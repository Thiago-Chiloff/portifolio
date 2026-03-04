import PixelTransition from './pixelTransition';
import Picture from "../../assets/mage_cat_walk_cycle.gif"
import { useNavigate } from 'react-router';
import './pixelTransition.css';

function TransitionPicture () {

  const gamePath = {
    game: "/game/game"
  }

  const navigateGame = useNavigate();

  const handleNavigateGame = (path) => {
    navigateGame(path)
  }

return (
<PixelTransition
  firstContent={
    <img
      src={Picture}
      alt="game"
      style={{ 
        width: "100%", 
        height: "100%", 
        objectFit: "cover", 
        borderRadius: "15px" 
      }}
    />
  }
  secondContent={
    <div className="button-container">
      <button 
        className="game-button pulse"
        onClick={() => {handleNavigateGame(gamePath.game)}}
      >
        🎮 Jogar Agora!
      </button>
    </div>
  }
  gridSize={20}
  pixelColor='#ffffff'
  animationStepDuration={0.7}
  className="custom-pixel-card"
/>
)
}

export default TransitionPicture;