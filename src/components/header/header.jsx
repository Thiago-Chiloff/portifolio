import { useNavigate } from "react-router";
import { useState } from "react";
import "../../css/header/header.css";
import { FaBars, FaTimes } from 'react-icons/fa';

function Header () {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const routes = {
        home: "/",
        about: "/aboutme/aboutme",
        certificates: "/certificates/certificates"
    }

    const handleClickChange = (path) => {
        navigate(path);
        setIsMenuOpen(false); 
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <>
            <div className="header">
                <div className="menu-toggle" onClick={toggleMenu}>
                 {isMenuOpen ? 
                    <FaTimes size={24} className="menu-icon" /> : 
                    <FaBars size={24} className="menu-icon" />
                }
                    </div>

                <div className="desktop-buttons">
                    <button onClick={() => handleClickChange(routes.home)}>Home</button>
                    <button onClick={() => handleClickChange(routes.about)}>Sobre Mim</button>
                    <button onClick={() => handleClickChange(routes.certificates)}>Certificados</button>
                </div>

                <div className={`mobile-menu ${isMenuOpen ? 'mobile-menu-open' : ''}`}>
                    <button onClick={() => handleClickChange(routes.home)}>Home</button>
                    <button onClick={() => handleClickChange(routes.about)}>Sobre Mim</button>
                    <button onClick={() => handleClickChange(routes.certificates)}>Certificados</button>
                </div>
                {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
            </div>
        </>
    )
}

export default Header;