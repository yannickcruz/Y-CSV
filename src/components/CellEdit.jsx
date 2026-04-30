import '../css/Editor.css'
import { useCallback, useEffect, useRef, useState } from 'react';

const CellEdit = ({ cellText, cellId, header, onClose }) => {
    const textareaRef = useRef(null);
    const [editedData, setEditedData] = useState(cellText);


    const handleExpansion = useCallback(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, []);

    const storeChanges = (newText) => {
        if(cellId !== null){
            setEditedData(newText);
            
        }
    }


    return(
        <div id="edit-cell">
            <textarea type="text" id="cell-selected" defaultValue={cellText} ref={textareaRef}
            onInput={handleExpansion} onChange={(e) => storeChanges(e.target.value)}/>
            <ul className="button-list">
                <li><button className="action-button" onClick={() => onClose(null)}>Voltar para tabela</button></li>
                <li><button className="action-button" onClick={() => onClose(editedData)}>Salvar</button></li>
            </ul>
        </div>
    )
}

export default CellEdit;