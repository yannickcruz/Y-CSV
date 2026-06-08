import "../css/StartPage.css"
import { NavLink } from "react-router-dom"
import { useState, useCallback } from "react"

const StartPage = ({openUploader}) => {

    const handleOpen = () => {
        openUploader(true);
    }

    return(
        <section id="StartPage">
            <div id="box-container">
                <h1 id="title">Bem-vindo ao Y-CSV</h1>
                <p id="description">Faça o upload do seu arquivo CSV e comece a analisar seus dados.</p>
                <ul className="start-btns">
                    <li className="btn"><button onClick={handleOpen}>Fazer Upload do CSV</button></li> 
                    <li className="btn"><NavLink to="/how-use" >Como Usar</NavLink></li>
                    <li className="btn"><NavLink to="/editor" >DEV - EDITOR</NavLink></li> {/*Editor colocado temporariamente para construção do componente*/}
                </ul>
            </div>
        </section>
    )
}

export default StartPage