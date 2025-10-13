import { useNavigate } from "react-router"
import { FaArrowLeft } from 'react-icons/fa';
import '../../css/backButton/backButton.css';

function BackButton () {
    const backAbout = useNavigate();

    const handleBackChange = () => {
        backAbout(-1);
    }

    return (
        <>
        <div className="back-button-container">
            <button className="back-button" onClick={handleBackChange}>
                <FaArrowLeft className="back-button-icon" />
                Voltar
            </button>
        </div>
        </>
    )
}

export default BackButton;