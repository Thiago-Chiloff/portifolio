import Squares from "./squares";
import '../../css/squares/squares.css';

function Background() {
    return (
        <>
         <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            pointerEvents:'unset'
        }}>
            <Squares 
                speed={0.6} 
                squareSize={70}
                direction='down'
                borderColor='rgba(51, 51, 51, 1)' 
                hoverFillColor='rgba(255, 255, 255, 1)' 
            />
        </div>
        </>
    );
}

export default Background;