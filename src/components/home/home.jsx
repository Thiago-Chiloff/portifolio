import Header from "../header/header";
import "../../css/home/home.css";
import { FaArrowRight, FaCode, FaVideo, FaBook } from 'react-icons/fa';
import { Link } from "react-router-dom";
import HomePicture from "../../assets/Nerd.png";
import TextType from "../typeText/textType";

function Home() {
    return (
        <>
            <Header />
            
            <div className="home-container">
                <div className="home-content">
                    <div className="home-text">
                        <h1>
                        <strong>
                        <TextType 
                        text={["Olá, meu nome é Thiago Chiloff." , "Hi, my name is Thiago Chiloff." , "こんにちは、私の名前は チアゴ・チロフです." ]}
                        typingSpeed={90}
                        pauseDuration={3000}
                        showCursor={true}
                        cursorCharacter="|"
                        className="highlight"
                        />
                        </strong>
                        </h1>
                        <h2>Desenvolvedor Full Stack & Editor de Vídeos</h2>
                        <p className="description">
                            Sou um desenvolvedor apaixonado por tecnologia, criativo e dedicado 
                            em transformar ideias em soluções digitais funcionais. 
                            Combinando código e criatividade para criar experiências incríveis.
                        </p>

                        <p className="description">
                            <strong>P.S.: Ache o Jogo dentro das paginas ;)</strong>
                        </p>

                        <div className="interests">
                            <div className="interest-item">
                                <FaCode size={24} className="iterest-icon" />
                                <span><strong>Programação</strong></span>
                            </div>
                            <div className="interest-item">
                                <FaVideo size={24} className="iterest-icon"/>
                                <span><strong>Edição de Vídeo</strong></span>
                            </div>
                            <div className="interest-item">
                                <FaBook size={24} className="iterest-icon"/>
                                <span><strong>Leitura</strong></span>
                            </div>
                        </div>

                        <div className="home-buttons">
                            <Link to="/aboutme/aboutme" className="btn primary">
                                Conheça Mais Sobre Mim <FaArrowRight />
                            </Link>
                            <Link to="/certificates/certificates" className="btn secondary">
                                Ver Certificados
                            </Link>
                        </div>
                    </div>

                    <div className="home-image">
                        <img src={HomePicture} alt="Thiago Chiloff - Desenvolvedor" />
                    </div>
                </div>        
                </div>
        </>
    )
}

export default Home;