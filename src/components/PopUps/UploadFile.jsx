import { useRef, useState } from "react";
import {CircleX} from 'lucide-react';
import "../../css/UploadFile.css"

const UploadFile = ({isClose, submit}) => {

    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    }

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    }

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'text/csv') {
            setFile(droppedFile);
        } else {
            alert('Envie um arquivo CSV válido.');
        }
    }

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
        } else {
            alert('Envie um arquivo CSV válido.');
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!file) return;
        const formData = new FormData();
        formData.append('file', file);
        console.log(formData);
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; 
        }
        isClose(false);
        submit(formData);
    }

    return(
        <div id="upload-file" className="pop-up">
            <div id="upload-container">
                <div className="pop-up-header">
                    <h2>Enviar Arquivo CSV</h2>
                </div>
                <form className="upload-file-form" onSubmit={handleSubmit}>
                    <div id="drop-area" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={isDragging ? 'dragging' : ''}>
                        {file ? <p>Arquivo selecionado: {file.name}</p> : <p>Arraste e solte um arquivo CSV aqui</p>}
                    </div>
                    <input type="file" accept=".csv" name="file" id="file-input" onChange={handleFileSelect} />
                    <div id="buttons-container">
                        <button type="submit" className="btn-style">
                            Upload
                        </button>
                        <button id="close-btn" className="btn-style" onClick={() => isClose(false)}>
                            <CircleX id="close-icon" /> Fechar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UploadFile;