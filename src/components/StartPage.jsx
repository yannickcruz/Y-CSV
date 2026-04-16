import "../css/StartPage.css"
import { NavLink } from "react-router-dom"

const StartPage = () => {
    return(
        <section id="StartPage">
            <div id="box-container">
                <h1 id="title">Bem-vindo ao Y-CSV</h1>
                <p id="description">Faça o upload do seu arquivo CSV e comece a analisar seus dados.</p>
                <ul className="start-btns">
                    <li className="btn"><NavLink to="/editor" >Fazer Upload do CSV</NavLink></li> {/*Editor colocado temporariamente para construção do componente*/}
                    <li className="btn"><NavLink to="/how-use" >Como Usar</NavLink></li>
                </ul>
            </div>
        </section>
    )
}

export default StartPage