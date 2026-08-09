import "../css/StartPage.css"
import { NavLink } from "react-router-dom"
import { useState, useCallback } from "react"
import CreateNewCSV from './PopUps/CreateNewCSV';

const StartPage = ({openUploader, loadStandardCSV}) => {

        const [openNewCSV, setOpenNewCSV] = useState(false);

        const openNewCSVPopUp = () => {
            setOpenNewCSV(true);
        }

        const closeNewCSVPopUp = () => {
            setOpenNewCSV(false);
        }

    const handleOpen = () => {
        openUploader(true);
    }

    return(
        <section id="StartPage">
            <div id="box-container">
                <h1 id="title">Bem-vindo ao Y-CSV</h1>
                <p id="description">Faça o upload do seu arquivo CSV e comece a analisar seus dados.</p>
                <ul className="start-btns">
                    <li className="btn" onClick={handleOpen}>Fazer Upload do CSV</li> 
                    <li className="btn"><NavLink to="/editor" >Acessar Editor</NavLink></li>
                    <li className="btn" onClick={openNewCSVPopUp}>Criar Novo CSV</li>
                </ul>
            </div>
            <CreateNewCSV isOpen={openNewCSV} onClose={() => setOpenNewCSV(false)}/>
        </section>
    )
}

export default StartPage