import '../../css/PopUps.css'

const LoadingScreen = ({attempts}) => {

    return(
        <div id="full-screen-component">
            <div id="fs_content">
                <h1 className="fs-title">Carregando Servidor</h1>
                <p className="fs-text">O servidor não está disponível no momento. Tentando carregar...</p>
                <p className="fs-text">Tentativa {attempts} de 30.</p>
            </div>
        </div>
    );
}

export default LoadingScreen;