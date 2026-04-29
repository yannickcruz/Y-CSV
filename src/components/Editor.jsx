import "../css/Editor.css"
import { useCallback, useEffect, useRef, useState } from "react";

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
    const [editedData, setEditedData] = useState('');
    const [data, setData] = useState(csv_example_id);

    const headers = csv_example.length > 0 ? Object.keys(csv_example[0]) : [];

    const handleExpansion = useCallback(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, []);

    const handleCellClick = (cellText, cellId, header) => {
        setCell(cellText);
        setCurrentCellEdit([cellId, header]);
    }

    const handleSaveCell = () => {
        if(currentCellEdit !== null){
            const updatedData = csv_example_id.map((item) => {
                if(item.id === currentCellEdit[0]){
                    return { ...item, [currentCellEdit[1]]: editedData };
                }
                return item;
            });
            setData(updatedData);
        }
        setCell(null);
        setCurrentCellEdit(null);
    }

    const storeChanges = (newText) => {
        if(currentCellEdit[0] !== null){
            setEditedData(newText);
            
        }
    }

    if(cell){
        return(
            <div id="edit-cell">
                <textarea type="text" id="cell-selected" defaultValue={cell} ref={textareaRef}
                onInput={handleExpansion} onChange={(e) => storeChanges(e.target.value)}/>
                <ul id="button-list">
                    <li><button className="action-button" onClick={() => setCell(null)}>Voltar para tabela</button></li>
                    <li><button className="action-button" onClick={handleSaveCell}>Salvar</button></li>
                </ul>
            </div>
        );
    }


    return(
        <section id="Editor">
            <header id="editor-header">
                <h1 id="editor-title">Y-CSV</h1>
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
        </section>
    )
}

export default Editor