import '../../css/PopUps.css'
import { useState } from 'react';

const AddColumn = ({isOpen, onClose, onSubmit}) => {
    if(!isOpen) return null;
    const [columnName, setColumnName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if(columnName.trim() === '') return;
        onSubmit(columnName);
        setColumnName('');
    }


    return (
        <div className="PopUp-container" id="add-column-container">
            <form action="" id="add-column-form" onSubmit={handleSubmit}>
                <label htmlFor="column-name">Nome da Coluna:</label>
                <input type="text" name="column-name" id="column-name" value={columnName} onChange={(e) => setColumnName(e.target.value)} />
                <button type="submit" className="editor-btn">Adicionar</button>
                <button type="button" className="editor-btn" onClick={onClose}>Cancelar</button>
            </form>
        </div>
    );
}

export default AddColumn;