import "../css/Editor.css"
import { useCallback, useEffect, useRef, useState } from "react";
import CellEdit from "./CellEdit";
import AddColumn from "./PopUps/AddColumn";
import localforage from "localforage";
import { useNavigate } from "react-router-dom";

const Editor = (csv) => {

    // Exemplo de JSON de CSV
    const csv_example = [
        {
            Filename: "image_filename.jpg",
            Title: "A short description of what the asset represents",
            Keywords: "Keyword1, Keyword2, Keyword3, Keyword4, Keyword5",
            Category: 3,
            Releases: "Haleeq Whitten, Ludovic Hillion, Morgan Greentstreet, Christine Manore"
        },
        {
            Filename: "footage_filename.mov",
            Title: "Up to 200 characters",
            Keywords: "Most important keywords first. Max 49 keywords.",
            Category: "Enter the number matching the category in the upload-CSV dialog",
            Releases: "The names you gave to the releases when you uploaded them on Adobe Stock"
        }
    ];

    const csv_example_id = csv_example.map((item, index) => ({ id: index, ...item }));

    const textareaRef = useRef(null);
    const [cell, setCell] = useState(null);
    const [currentCellEdit, setCurrentCellEdit] = useState(null);
    const [data, setData] = useState(null);
    const [editedData, setEditedData] = useState('');
    const [addColumnPopup, setAddColumnPopup] = useState(false);
    const [headers, setHeaders] = useState(null);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [chunkCount, setChunkCount] = useState(0);
    const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            try{
                const chunkCount = await localforage.getItem('csvMetadata').then((metadata) => {
                    if(metadata && metadata.chunkLength){
                        return metadata.chunkLength;
                    }
                })
                setChunkCount(chunkCount);

                const headers = await localforage.getItem('headers');
                if(headers){
                    setHeaders(headers);
                }

                let currentChunk = await localforage.getItem(`csvChunk_${currentChunkIndex}`);
                if(currentChunk){
                    const rowsWithId = currentChunk.rows.map((item, index) => ({ id: index, ...item }));
                    currentChunk.rows = rowsWithId;
                    setData(currentChunk);
                }
                setIsLoading(false);
                
            } catch (error) {
                console.error('Error retrieving chunk count from IndexedDB:', error);
                alert('Erro ao carregar dados do IndexedDB! Voltando para página inicial.');
                navigate('/');
            }
        }
        getData();
    }, []);

    useEffect(() => {
        const getCurrentChunk = async () => {
            try{
                let currentChunk = await localforage.getItem(`csvChunk_${currentChunkIndex}`);
                if(currentChunk){
                    const rowsWithId = currentChunk.rows.map((item, index) => ({ id: index, ...item }));
                    currentChunk.rows = rowsWithId
                    setData(currentChunk);
                }
            } catch (error) {
                console.error('Error retrieving current chunk from IndexedDB:', error);
            }
        }
        getCurrentChunk();
    }, [currentChunkIndex]);

    if(isLoading){
        return(
            <div className="loading-screen">
                <p>Carregando dados...</p>
            </div>
        );
    }

    const saveToIndexedDB = (data, type) => {
        if(type === 'data'){
            if(data.chunkIndex === currentChunkIndex){
                localforage.setItem(`csvChunk_${currentChunkIndex}`, data);
            }
        }
        if(type === 'headers'){
            localforage.setItem('headers', data);
        }
    }


    const handleCellClick = (cellText, cellId, header) => {
        if(isDeleteMode){
            deleteRow(cellId);
            return;
        }
        setCell(cellText);
        setCurrentCellEdit([cellId, header]);
    }

    
    if(cell !== null){
        return(
            <CellEdit cellText={cell} cellId={currentCellEdit[0]} header={currentCellEdit[1]} onClose={(editedData) => {
                if(editedData !== null){
                    const updatedData = data.rows.map((item) => {
                    if(item.id === currentCellEdit[0]){
                        return { ...item, [currentCellEdit[1]]: editedData };
                    }
                    return item;
                    });
                    let chunk = data;
                    chunk.rows = updatedData;
                    setData(chunk);
                    setCell(null);
                    setCurrentCellEdit(null);
                    saveToIndexedDB(chunk, 'data');
                } else{
                    setCell(null);
                    setCurrentCellEdit(null);
                }
            }} />
        );
    }

    const openAddColumnPopup = () => {
        setAddColumnPopup(true);
    }

    const closeAddColumnPopup = () => {
        setAddColumnPopup(false);
    }

    const addNewColumn = (columnName) => {
        const updatedData = data.map((item) => {
            return { ...item, [columnName]: '' };
        });
        setHeaders([...headers, columnName]);
        setData(updatedData);
        closeAddColumnPopup();
        saveToIndexedDB(updatedData, 'data');
        saveToIndexedDB([...headers, columnName], 'headers');
    }

    const addRow = () => {
        const newRow = headers.reduce((acc, header) => {
            acc[header] = '';
            return acc;
        }, {});
        setData([...data, { ...newRow, id: data.length }]);
        saveToIndexedDB([...data, { ...newRow, id: data.length }], 'data');
    }

    const updateChunk = (newRows, newHeaders) => {
        setData(prev => ({
            ...prev,
            ...(newHeaders && { headers: newHeaders }),
            ...(newRows && { rows: newRows })
        }));
        saveToIndexedDB(data, 'data');
    }

    const deleteColumn = (columnName) => {
        if(!isDeleteMode) return;
        if(columnName){
            const updatedData = data.rows.map((item) => {
            const { [columnName]: _, ...rest } = item;
            return rest;
            });
            const newHeaders = headers.filter(header => header !== columnName);
            updateChunk(updatedData, newHeaders);

            setHeaders(newHeaders);
            saveToIndexedDB(newHeaders, 'headers');
        }
    }

    const deleteRow = (rowId) => {
        if(!isDeleteMode) return;
        const updatedData = data.rows.filter((item) => item.id !== rowId);
        updateChunk(updatedData);
    }


    return(
        <section id="Editor">
            <header id="editor-header">
                <h1 id="editor-title" onClick={() => {navigate('/')}}>Y-CSV</h1>
                <div id="editor-buttons">
                    <ul className="main-editor-btns">
                        <li><button className="editor-btn" onClick={openAddColumnPopup}>Adicionar Coluna</button></li>
                        <li><button className="editor-btn" onClick={addRow}>Adicionar Linha</button></li>
                        <li><button className="editor-btn" onClick={() => setIsDeleteMode(!isDeleteMode)}>Remover Linhas/Colunas</button></li>
                        <li id="page-slider">
                            <p id="page-display">Página {currentChunkIndex + 1} de {chunkCount}</p>
                            <select id="page-select" value={currentChunkIndex} onChange={(e) => {
                                const newIndex = parseInt(e.target.value);
                                setCurrentChunkIndex(newIndex);
                            }}>
                                {Array.from({ length: chunkCount }, (_, i) => (
                                    <option key={i} value={i}>
                                        Página {i + 1}
                                    </option>
                                ))}
                            </select>
                        </li>
                    </ul>
                </div>
            </header>

            <div id="table-container">
                <table id="csv-table">
                    <thead>
                        <tr>
                            {headers.map((header) => (
                                <th className={`${isDeleteMode ? 'delete-mode-header' : ''}`} onClick={() => deleteColumn(header)} key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.rows.map((row) => (
                            <tr key={row.id}>
                                {headers.map((header) => (
                                    <td className={`csv-cell ${isDeleteMode ? 'delete-mode-body' : ''}`} onClick={() => handleCellClick(row[header], row.id, header)} key={header}>
                                        {row[header]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                    
            </div>
            <AddColumn isOpen={addColumnPopup} onClose={() => setAddColumnPopup(false)} onSubmit={addNewColumn} />
        </section>
    )
}

export default Editor