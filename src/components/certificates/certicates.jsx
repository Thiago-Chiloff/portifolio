import PictureCertificateCurriculo from "../../assets/certificates/curriculo.jpg";
import PictureCertificateCC50 from "../../assets/certificates/cc50.jpg"
import PictureCertificateSenac from "../../assets/certificates/senac.jpg"
import { useState } from "react";
import "../../css/certificates/certificates.css"


function Certificates() {
    const [zoomImage, setZoomImage] = useState(null);

    const handleImageClick = (imageSrc) => {
        setZoomImage(imageSrc);
    };

    const closeZoom = () => {
        setZoomImage(null);
    };

    return (
        <>
            <div className="certificates">
                <div className="certificate-block" onClick={() => handleImageClick(PictureCertificateCurriculo)}>
                    <div className="certificate-image">
                        <img src={PictureCertificateCurriculo} alt="curriculo" />
                    </div>
                    <h2>Currículo</h2>
                </div>

                <div className="certificate-block" onClick={() => handleImageClick(PictureCertificateCC50)}>
                    <div className="certificate-image">
                        <img src={PictureCertificateCC50} alt="cc50" />
                    </div>
                    <h2>Certificado CC50</h2>
                </div>

                <div className="certificate-block" onClick={() => handleImageClick(PictureCertificateSenac)}>
                    <div className="certificate-image">
                        <img src={PictureCertificateSenac} alt="senac" />
                    </div>
                    <h2>Certificado SENAC</h2>
                </div>
            </div>

            {zoomImage && (
                <div className="zoom-modal" onClick={closeZoom}>
                    <div className="zoom-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-button" onClick={closeZoom}>&times;</span>
                        <img src={zoomImage} alt="Certificado em zoom" />
                    </div>
                </div>
            )}
        </>
    )
}

export default Certificates;