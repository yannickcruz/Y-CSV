import '../../css/PopUps.css'

const ErrorPopUp = ({isOpen, onClose}) => {
    return(
        <div id="PopUp-container">
            <div className="inner-container">
                <p className="PopUp-Text">Para criar uma linha, precisa-se de ao menos uma coluna!</p>
                <button className="editor-btn" onClick={onClose}>Fechar</button>
            </div>
        </div>
    )
}

export default ErrorPopUp;