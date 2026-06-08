import { useRef, useState } from "react";
import {CircleX} from 'lucide-react';

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
        submit(formData);
    }

    return(
        <div id="upload-file" className="pop-up">
            <div className="pop-up-header">
                <h2>Upload File</h2>
                <button className="close-btn" onClick={() => isClose(false)}>
                    <CircleX />
                </button>
            </div>
            <form action="/upload" className="upload-file-form" method="post" encType="multipart/form-data">
                <div id="drop-area" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={isDragging ? 'dragging' : ''}>

                </div>
                <input type="file" accept=".csv" name="file" />
                {file ? <p>Arquivo selecionado: {file.name}</p> : <p>Arraste e solte um arquivo CSV aqui ou clique para selecionar</p>}
                <button type="submit">Upload</button>
            </form>
        </div>
    )
}

export default UploadFile;