import '../../css/PopUps.css'
import { NavLink } from 'react-router-dom';
import PB_CSV from '../../pre-built-csv.json';
import { useState } from 'react';
import { TriangleAlert } from 'lucide-react';

const CreateNewCSV = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const [sendState, setSendState] = useState('new');
    const Pre_built_CSV = PB_CSV;

    return (
        <div className="PopUp-container">
            <div className="inner-container" id='create-new-inner'>
                <div id="c-n-alert-container">
                    <h2 id="alert-title"><TriangleAlert />Alerta!</h2>
                    <p className="PopUp-Text">
                        Atenção, ao criar novo CSV, o arquivo anterior será completamente excluído!
                    </p>
                </div>
                <div id="c-n-select-pb">
                    <p className="PopUp-Text">Selecione o modelo de CSV a ser criado</p>
                    <select name="" id="select-pre-built" onChange={(e) => setSendState(e.target.value)}>
                        <option>Novo CSV vazio</option>
                        {
                            Pre_built_CSV.map(model => {
                                return <option key={model.ID} value={model.CSV_Model}>{model.CSV_Model}</option>
                            })
                        }
                    </select>
                </div>
                <NavLink to="/editor" className="PopUp-btn" state={sendState}>Criar</NavLink>
                <button className="PopUp-btn" onClick={onClose}>Cancelar</button>
            </div>
        </div>
    )

}

export default CreateNewCSV;