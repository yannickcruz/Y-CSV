import "../css/StartPage.css"
import { NavLink } from "react-router-dom"
import { useState, useCallback } from "react"

const StartPage = ({openUploader, loadStandardCSV}) => {

    const handleOpen = () => {
        loadStandardCSV();
        openUploader(true);
    }

    return(
        <section id="StartPage">
            <div id="box-container">
                <h1 id="title">Bem-vindo ao Y-CSV</h1>
                <p id="description">Faça o upload do seu arquivo CSV e comece a analisar seus dados.</p>
                <ul className="start-btns">
                    <li className="btn" onClick={handleOpen}>Fazer Upload do CSV</li> 
                    <li className="btn"><NavLink to="/how-use" >Como Usar</NavLink></li>
                    <li className="btn"><NavLink to="/editor" >Acessar Editor</NavLink></li>
                    <li className="btn"><NavLink to="/editor" state={'new'}>Criar Novo CSV</NavLink></li>
                </ul>
            </div>
        </section>
    )
}

export default StartPage