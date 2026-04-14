import "../css/StartPage.css"

const StartPage = () => {
    return(
        <section id="StartPage">
            <div id="box-container">
                <h1 id="title">Bem-vindo ao Y-CSV</h1>
                <p id="description">Faça o upload do seu arquivo CSV e comece a analisar seus dados.</p>
                <ul className="start-btns">
                    <li><button className="btn">Fazer Upload do CSV</button></li>
                    <li><button className="btn">Como Usar</button></li>
                </ul>
            </div>
        </section>
    )
}

export default StartPage