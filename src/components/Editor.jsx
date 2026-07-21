import "../css/Editor.css"
import { useCallback, useEffect, useRef, useState } from "react";
import CellEdit from "./CellEdit";
import AddColumn from "./PopUps/AddColumn";
import ErrorPopUp from "./PopUps/ErrorPopUp";
import localforage from "localforage";
import { useNavigate, useLocation } from "react-router-dom";
import useCsvDataHandler from "./hooks/csvDataHandler";
import useCsvCRUD from "./hooks/csvCRUD";

const Editor = ({ downloadCSV }) => {

    const textareaRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const { data,
        setData,
        chunkState,
        setChunkState,
        isLoading,
        updateChunk,
        saveToIndexedDB,
        editedHeaders,
        setEditedHeaders,
        skipFetch } = useCsvDataHandler(location.state, navigate);
    
    const {openPopUp,
        addNewColumn,
        addRow,
        deleteColumn,
        deleteRow,
        PopUp,
        isDeleteMode,
        setIsDeleteMode,
        setPopUp} = useCsvCRUD(data, setData, chunkState, setChunkState, updateChunk, saveToIndexedDB, skipFetch);

    const [cell, setCell] = useState(null);


    if (isLoading) {
        return (
            <div className="loading-screen">
                <p>Carregando dados...</p>
            </div>
        );
    } else {
        if (!data) {
            return (
                <div id="editor-null">
                    <div id="inner-container">
                        <h1 id="editor-null-title">Nenhum CSV válido carregado!</h1>
                        <p id="editor-null-text">Crie um novo CSV ou carregue um novo arquivo</p>
                        <button id="null-btn" onClick={() => navigate('/')}>Voltar para página Inicial</button>
                    </div>
                </div>
            );
        }
    }


    const handleCellClick = (cellText, cellId, header) => {
        if (isDeleteMode) {
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


    if (cell !== null) {
        return (
            <CellEdit cellText={cell.cellText} cellId={cell.cellId} header={cell.header} onClose={(editedData) => {
                if (editedData !== null) {
                    const updatedData = data.rows.map((item) => {
                        if (item.id === cell.cellId) {
                            return { ...item, [cell.header]: editedData };
                        }
                        return item;
                    });
                    let chunk = data;
                    chunk.rows = updatedData;
                    setData(prev => ({
                        ...prev,
                        rows: updatedData
                    }));
                    setCell(null);
                    saveToIndexedDB(chunk, 'data');
                } else {
                    setCell(null);
                }
            }} />
        );
    }

    return (
        <section id="Editor">
            <header id="editor-header">
                <h1 id="editor-title" onClick={() => { navigate('/') }}>Y-CSV</h1>
                <div id="editor-buttons">
                    <ul className="main-editor-btns">
                        <li><button className="editor-btn" onClick={() => openPopUp('AddColumn')}>Adicionar Coluna</button></li>
                        <li><button className="editor-btn" onClick={addRow}>Adicionar Linha</button></li>
                        <li><button className="editor-btn" onClick={() => setIsDeleteMode(!isDeleteMode)}>Remover Linhas/Colunas</button></li>
                        <li><button className="editor-btn" onClick={() => downloadCSV()}>Baixar CSV</button></li>
                        <li id="page-slider">
                            <p id="page-display">Página {chunkState.currentChunkIndex + 1} de {chunkState.chunkCount}</p>
                            <select id="page-select" value={chunkState.currentChunkIndex} onChange={(e) => {
                                const newIndex = parseInt(e.target.value);
                                setChunkState(prev => ({ ...prev, currentChunkIndex: newIndex }));
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
            <AddColumn isOpen={PopUp.addColumn} onClose={() => setPopUp(prev => ({ ...prev, addColumn: false }))} onSubmit={addNewColumn} />
            <ErrorPopUp isOpen={PopUp.rowError} onClose={() => setPopUp(prev => ({ ...prev, rowError: false }))} />
        </section>
    )
}

export default Editor;