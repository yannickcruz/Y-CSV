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
    const [data, setData] = useState(csv_example_id);
    const [editedData, setEditedData] = useState('');
    const [addColumnPopup, setAddColumnPopup] = useState(false);
    const [headers, setHeaders] = useState(csv_example.length > 0 ? Object.keys(csv_example[0]) : []);

    const navigate = useNavigate();

    useEffect(() => {
        try{
            const storedData = localforage.getItem('csvData').then((newData) => {
                if(newData){
                    if(typeof(newData) === 'string'){
                        setData(JSON.parse(newData));
                    } else {
                        setData(newData);
                    }
                }
            });
            const storedHeaders = localforage.getItem('csvHeaders').then((newData) => {
                if(newData){
                    if(typeof(newData) === 'string'){
                        setHeaders(JSON.parse(newData));
                    } else {
                        setHeaders(newData);
                    }
                }
            });
        } catch{
            alert('Erro ao carregar dados do IndexedDB! Voltando para página inicial.');
            navigate('/');
        }
    }, []);

    const saveToIndexedDB = (data, type) => {
        if(type === 'data'){
            localforage.setItem('csvData', data);
        }
        if(type === 'headers'){
            localforage.setItem('csvHeaders', data);
        }
    }


    const handleCellClick = (cellText, cellId, header) => {
        setCell(cellText);
        setCurrentCellEdit([cellId, header]);
    }

    
    if(cell !== null){
        return(
            <CellEdit cellText={cell} cellId={currentCellEdit[0]} header={currentCellEdit[1]} onClose={(editedData) => {
                if(editedData !== null){
                    const updatedData = data.map((item) => {
                    if(item.id === currentCellEdit[0]){
                        return { ...item, [currentCellEdit[1]]: editedData };
                    }
                    return item;
                    });
                    setData(updatedData);
                    setCell(null);
                    setCurrentCellEdit(null);
                    saveToIndexedDB(updatedData, 'data');
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


    return(
        <section id="Editor">
            <header id="editor-header">
                <h1 id="editor-title">Y-CSV</h1>
                <div id="editor-buttons">
                    <ul className="main-editor-btns">
                        <li><button className="editor-btn" onClick={openAddColumnPopup}>Adicionar Coluna</button></li>
                        <li><button className="editor-btn" onClick={addRow}>Adicionar Linha</button></li>
                    </ul>
                </div>
            </header>

            <div id="table-container">
                <table id="csv-table">
                    <thead>
                        <tr>
                            {headers.map((header) => (
                                <th key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr key={row.id}>
                                {headers.map((header) => (
                                    <td onClick={() => handleCellClick(row[header], row.id, header)} key={header} className="csv-cell">
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