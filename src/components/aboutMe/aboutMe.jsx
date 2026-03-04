import Header from "../header/header";
import "../../css/about/about.css";
import { FaGithub,  FaWhatsapp, FaFileDownload } from 'react-icons/fa';
import { SiGmail, SiDiscord } from 'react-icons/si';
import Transition from "../PixelTransition/transition";
import TextType from "../typeText/textType";
import PictureCurriculo from "../../assets/certificates/curriculo.jpg"
function AboutMe() {
    return (
        <>
            <Header />
            
            <div className="about-container">
                <div className="content-column">
                    <div className="about-me">
                        <h1>Sobre Mim</h1>
                        <p>Sou uma pessoa esforçada e bem criativa.</p>
                        <p>Tenho grande paixão por programação, jogos e, especialmente, pela leitura de bons livros.</p>
                        <p>Sou mais reservado, mas compenso com um bom humor constante...</p>
                        <p>Atuo como freelancer em desenvolvimento e também realizo edição de vídeos.</p>
                        <strong>
                        <TextType 
                        text={["Contudo, obrigado por vir aqui :)" , "However, thank's for coming here :)" , "しかしながら、ここに来てくれてありがとう :)" ]}
                        typingSpeed={90}
                        pauseDuration={3000}
                        showCursor={true}
                        cursorCharacter="|"
                        />
                        </strong>
                    </div>

                    <div className="contact">
                        <h2>Meus contatos são:</h2>
                        <div className="contact-icons">
                            <a href="mailto:chiloffthiago@gmail.com" target="_blank" rel="noopener noreferrer">
                                <SiGmail size={35} style={{ color: '#EA4335' }} />
                                <span>E-mail</span>
                            </a>
                            <a href="https://github.com/Thiago-Chiloff" target="_blank" rel="noopener noreferrer">
                                <FaGithub size={35} style={{ color: '#ffffff' }} />
                                <span>GitHub</span>
                            </a>
                           
                            <a href="https://wa.me/5516997993006" target="_blank" rel="noopener noreferrer">
                                <FaWhatsapp size={35} style={{ color: '#25D366' }} />
                                <span>WhatsApp</span>
                            </a>
                            <a href="https://discord.com/users/678423145278865439" target="_blank" rel="noopener noreferrer">
                                <SiDiscord size={35} style={{ color: '#5865F2' }} />
                                <span>Discord</span>
                            </a>
                            <a href={PictureCurriculo} download>
                                <FaFileDownload size={35} style={{ color: '#ffffff' }} />
                                <span>Currículo</span>
                            </a>
                        </div>
                    </div>

                    <div className="languages-programation">
                        <h2>Minhas principais linguagens de programação são:</h2>
                        <div className="tech-icons">
                            <span>JavaScript</span>
                            <span>TypeScript</span>
                            <span>Python</span>
                            <span>React</span>
                            <span>Node.js</span>
                            <span>SQL</span>
                            <span>HTML</span>
                            <span>CSS</span>
                            <span>SaaS</span>
                        </div>
                        <br />
                        <h2>Este portifolio foi programado com:</h2>
                        <div className="tech-icons">
                            <span>React</span>
                            <span>JavaScript</span>
                            <span>CSS</span>
                        </div>
                    </div>
                    
                    <div className="languages">
                        <h2>Falo alguns idiomas, dentre elas estão:</h2>
                        <div className="languages-grid">
                            <div className="language-item">
                                <h3>Português</h3>
                                <p>Nativo</p>
                            </div>
                            <div className="language-item">
                                <h3>Inglês</h3>
                                <p>Intermediário</p>
                            </div>
                            <div className="language-item">
                                <h3>Japonês</h3>
                                <p>Iniciante</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="my-image">
                    <Transition />
                </div>
            </div>
        </>
    )
}

export default AboutMe;