import "../css/Editor.css"
import { useCallback, useEffect, useRef, useState } from "react";
import CellEdit from "./CellEdit";
import AddColumn from "./PopUps/AddColumn";
import localforage from "localforage";
import { useNavigate } from "react-router-dom";

const Editor = (csv) => {

    const textareaRef = useRef(null);
    const skipFetch = useRef(false);

    const [cell, setCell] = useState(null);
    const [data, setData] = useState(null);
    const [addColumnPopup, setAddColumnPopup] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [chunkState, setchunkState] = useState({
        chunkCount: 0,
        currentChunkIndex: 0
    });
    const [editedHeaders, setEditedHeaders] = useState(null);

    const navigate = useNavigate();

    const updateChunk = (newRows, newHeaders) => {
        setData(prev => {
            const updated = {
                ...prev,
                ...(newHeaders && { headers: newHeaders }),
                ...(newRows && { rows: newRows })
            };
            saveToIndexedDB(updated, 'data');
            return updated;
        });
    }

    useEffect(() => {
        const getData = async () => {
            try{
                const chunkCount = await localforage.getItem('csvMetadata').then((metadata) => {
                    if(metadata && metadata.chunkLength){
                        return metadata.chunkLength;
                    }
                })
                setchunkState(prev => ({...prev, chunkCount: chunkCount}));
                const currentIndex = chunkState.currentChunkIndex;
                
                let currentChunk = await localforage.getItem(`csvChunk_${currentIndex}`);
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
        if(skipFetch.current){
            skipFetch.current = false;
            return;
        }
        const getCurrentChunk = async () => {
            try{
                let currentChunk = await localforage.getItem(`csvChunk_${chunkState.currentChunkIndex}`);
                if(currentChunk){
                    if(editedHeaders){
                        currentChunk.headers = editedHeaders;
                        saveToIndexedDB(currentChunk, 'data');
                    }
                    const rowsWithId = currentChunk.rows.map((item, index) => ({ id: index, ...item }));
                    currentChunk.rows = rowsWithId
                    setData(currentChunk);
                }
            } catch (error) {
                console.error('Error retrieving current chunk from IndexedDB:', error);
            }
        }
        getCurrentChunk();
    }, [chunkState.currentChunkIndex]);

    if(isLoading){
        return(
            <div className="loading-screen">
                <p>Carregando dados...</p>
            </div>
        );
    }

    const saveToIndexedDB = (data, type, explicitIndex) => {
        const currentIndex = explicitIndex ?? chunkState.currentChunkIndex;

        if(type === 'data'){
            if(data.chunkIndex === currentIndex){
                localforage.setItem(`csvChunk_${currentIndex}`, data);
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
        const cellEdit = {
            cellText: cellText,
            cellId: cellId,
            header: header
        }
        setCell(cellEdit);
    }

    
    if(cell !== null){
        return(
            <CellEdit cellText={cell.cellText} cellId={cell.cellId} header={cell.header} onClose={(editedData) => {
                if(editedData !== null){
                    const updatedData = data.rows.map((item) => {
                    if(item.id === cell.cellId){
                        return { ...item, [cell.header]: editedData };
                    }
                    return item;
                    });
                    let chunk = data;
                    chunk.rows = updatedData;
                    setData(chunk);
                    setCell(null);
                    saveToIndexedDB(chunk, 'data');
                } else{
                    setCell(null);
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

    const addNewColumn = async (columnName) => {

        for(let i = 0; i < chunkState.chunkCount; i++){
            const chunkToUpdate = await localforage.getItem(`csvChunk_${i}`);

            const updatedRows = chunkToUpdate.rows.map((item) => {
                return { ...item, [columnName]: '' };
            });

            const updatedHeaders = [...chunkToUpdate.headers, columnName];
            chunkToUpdate.rows = updatedRows;
            chunkToUpdate.headers = updatedHeaders;

            await localforage.setItem(`csvChunk_${i}`, chunkToUpdate);
            if(chunkToUpdate.chunkIndex === data.chunkIndex){
                updateChunk(updatedRows, updatedHeaders);
            }
        }

        const headers = data.headers;
        const newHeaders = [...headers, columnName];
        closeAddColumnPopup();
        saveToIndexedDB([...headers, columnName], 'headers');
    }

    const addRow = async () => {
        const newRow = data.headers.reduce((acc, header) => {
            acc[header] = '';
            return acc;
        }, {});

        const L_Chunk = await localforage.getItem(`csvChunk_${chunkState.chunkCount - 1}`);

        let lastIndexUpdate = null;
        if(data.chunkIndex === L_Chunk.chunkIndex){
            lastIndexUpdate = L_Chunk.chunkIndex;
        }

        if(data.rows.length >= 100 && L_Chunk.rows.length < 100){
            const lastIndex = chunkState.chunkCount - 1;

            const newData = [...L_Chunk.rows, {...newRow, id: L_Chunk.rows.length}];
            const updatedLastChunk = { ...L_Chunk, rows: newData };

            await saveToIndexedDB(updatedLastChunk, 'data', lastIndex);
            skipFetch.current = true;

            setData(updatedLastChunk);
            setchunkState(prev => ({...prev, currentChunkIndex: lastIndex}));
            return;
        } 
        
        if(data.rows.length >= 100 && L_Chunk.rows.length === 100){
            skipFetch.current = true;

            const newLastIndex = chunkState.chunkCount;
            const newHeaders = data.headers;
            const newChunkRows = [{id: 0, ...newRow}];

            const newChunk = {
                headers: newHeaders,
                rows: newChunkRows,
                chunkIndex: newLastIndex
            };

            const newMetadata = await localforage.getItem('csvMetadata').then((metadata) => {
                return {...metadata, chunkLength: newLastIndex + 1}
            });
            await localforage.setItem('csvMetadata', newMetadata);

            setData(newChunk);

            await localforage.setItem(`csvChunk_${chunkState.chunkCount}`, newChunk);
            setchunkState(prev => ({chunkCount: newLastIndex + 1, currentChunkIndex: newLastIndex}) );
            return;
        }

        const newData = [...data.rows, {...newRow, id: data.rows.length}];
        updateChunk(newData, null, lastIndexUpdate);
    }

    const deleteColumn = async (columnName) => {
        if(!isDeleteMode || !columnName) return;

        for(let i = 0; i < chunkState.chunkCount; i++){
            const chunkToUpdate = await localforage.getItem(`csvChunk_${i}`);

            const updatedRows = chunkToUpdate.rows.map((item) => {
                const { [columnName]: _, ...rest } = item;
                return rest;
            });
            const updatedHeaders = chunkToUpdate.headers.filter(h => h !== columnName);

            chunkToUpdate.rows = updatedRows;
            chunkToUpdate.headers = updatedHeaders;

            await localforage.setItem(`csvChunk_${i}`, chunkToUpdate);

            if(chunkToUpdate.chunkIndex === data.chunkIndex){
                updateChunk(chunkToUpdate.rows, chunkToUpdate.headers);
            }
        }

        saveToIndexedDB(data.headers.filter(h => h !== columnName), 'headers');
    }

    const deleteRow = (rowId) => {
        if(!isDeleteMode) return;
        const filtered = data.rows.filter((item) => item.id !== rowId);
        const reindexed = filtered.map((item, index) => ({ ...item, id: index })); 
        updateChunk(reindexed);
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
                            <p id="page-display">Página {chunkState.currentChunkIndex + 1} de {chunkState.chunkCount}</p>
                            <select id="page-select" value={chunkState.currentChunkIndex} onChange={(e) => {
                                const newIndex = parseInt(e.target.value);
                                setchunkState(prev => ({...prev, currentChunkIndex: newIndex}));
                            }}>
                                {Array.from({ length: chunkState.chunkCount }, (_, i) => (
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
                            {data.headers.map((header) => (
                                <th className={`${isDeleteMode ? 'delete-mode-header' : ''}`} onClick={() => deleteColumn(header)} key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.rows.map((row) => (
                            <tr key={row.id}>
                                {data.headers.map((header) => (
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