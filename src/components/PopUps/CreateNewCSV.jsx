import '../../css/PopUps.css'
import { NavLink } from 'react-router-dom';

const CreateNewCSV = ({isOpen, onClose}) => {
    if(!isOpen) return null;

    return(
        <div className="PopUp-container">
            <div id="inner-container">
                <h2 id="alert-title">Alerta!</h2>
                <p id="alert-text">
                    Atenção, ao criar novo CSV, o arquivo anterior será completamente excluído! Deseja continuar?
                </p>
                <NavLink to="/editor" className="editor-btn" state={'new'}>Criar</NavLink>
                <button className="editor-btn" onClick={onClose}>Cancelar</button>
            </div>
        </div>
    )

}

export default CreateNewCSV;