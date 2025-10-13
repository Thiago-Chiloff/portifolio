import { useState, useEffect, useCallback } from 'react';
import BackButton from '../backButton/backButton';
import './game.css';

interface Position {
  x: number;
  y: number;
}

function Game() {
  const GRID_SIZE = 25;
  const GAME_SPEED = 100;

  const [snake, setSnake] = useState<Position[]>([{ x: 12, y: 12 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Efeito para adicionar classe ao body apenas na página do jogo
  useEffect(() => {
    // Adiciona a classe quando o componente monta
    document.body.classList.add('game-page');
    
    // Remove a classe quando o componente desmonta
    return () => {
      document.body.classList.remove('game-page');
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Gerar comida em posição aleatória
  const generateFood = useCallback((): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }, []);

  // Inicializar jogo
  const initGame = useCallback(() => {
    setSnake([{ x: 12, y: 12 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
  }, [generateFood]);

  // Movimentação da cobra
  const moveSnake = useCallback(() => {
    if (gameOver || isMobile) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Verificar colisão com as paredes
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return prevSnake;
      }

      // Verificar colisão com próprio corpo
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Verificar se comeu a comida
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
        setScore(prev => prev + 10);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, generateFood, isMobile]);

  // Controles do teclado - AGORA COM W, A, S, D Buceta
  useEffect(() => {
    if (isMobile) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      const key = e.key.toLowerCase();

      switch (key) {
        case 'w':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 's':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'a':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'd':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        // Mantendo suporte às setas também (opcional)
        case 'arrowup':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'arrowdown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'arrowleft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'arrowright':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver, isMobile]);

  // Loop do jogo
  useEffect(() => {
    if (gameOver || isMobile) return;

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake, gameOver, isMobile]);

  // Inicializar jogo ao montar componente
  useEffect(() => {
    if (!isMobile) {
      initGame();
    }
  }, [initGame, isMobile]);

  // Se for mobile, mostra mensagem 
  if (isMobile) {
    return (
      <div className="game-container">
        <div className="mobile-message">
          <h2>🎮 Você achou o jogo!</h2>
          <p className="mobile-message">Mas ele é exclusivo de PC :(</p>
          <p className="mobile-message">Use um PC para jogar o clone da Cobrinha!</p>
          <div className="mobile-icon">💻</div>
          <BackButton />
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <BackButton />
      
      <div className="game-content">
        <div className="game-board-section">
          
          
          <div 
            className="game-board"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 25px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 25px)`
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              const isSnake = snake.some(segment => segment.x === x && segment.y === y);
              const isFood = food.x === x && food.y === y;

              return (
                <div
                  key={index}
                  className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
                />
              );
            })}
          </div>
        </div>

        <div className="controls-section">
          
          <h3>Como Jogar</h3>
          <div className="controls-text">
            <p>Use as teclas <strong>W, A, S, D</strong> para controlar a cobra:</p>
          </div>
          
          <div className="wasd-controls">
            <div className="control-row">
              <kbd>W</kbd>
            </div>
            <div className="control-row">
              <kbd>A</kbd>
              <kbd>S</kbd>
              <kbd>D</kbd>
            </div>
            <div className="control-label">
              ↑ Cima (W)<br/>
              ← Esquerda (A) ↓ Baixo (S) → Direita (D)
            </div>
          </div>

          <div className="game-instructions">
            <h4>Objetivo do Jogo</h4>
            <ul>
              <li>Coma a comida vermelha para crescer</li>
              <li>Não bata nas paredes ou no próprio corpo</li>
              <li>Quanto mais longo, mais desafiador!</li>
            </ul>
          </div>
        </div>
      </div>

      {gameOver && (
        <div className="game-over">
          <h3>Game Over!</h3>
          <p>Pontuação Final: {score}</p>
          <button onClick={initGame} className="restart-button">
            Jogar Novamente
          </button>
        </div>
      )}
    </div>
  );
}

export default Game;