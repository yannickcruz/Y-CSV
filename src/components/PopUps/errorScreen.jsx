import { useNavigate } from 'react-router-dom';
import '../../css/PopUps.css'
import { useState } from 'react';

const ErrorScreen = ({ errType, close }) => {
    const navigate = useNavigate();

    const errorMessages = {
        operation: {
            title: 'Falha ao processar informação.',
            text: 'Uma falha ocorreu durante a operação anterior. Tente novamente.'
        },
        serverFault: {
            title: 'Falha ao carregar o servidor',
            text: 'O servidor não está disponível no momento. Tente novamente mais tarde!'
        }
    }

    const {title, text} = errorMessages[errType];
    return (
        <div id="full-screen-component">
            <div id="fs_content">
                <h1 className="fs-title" id='err-title'>{title}</h1>
                <p className="fs-text">{text}</p>
                {errType === 'operation' && <button id='fs-return' onClick={() => close(null)}>Voltar para tela inicial</button>}
            </div>
        </div>
    );
}

export default ErrorScreen;