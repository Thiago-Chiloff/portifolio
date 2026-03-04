import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { FaArrowLeft, FaDesktop, FaMobileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../css/mineClone/mineClone.css';

// Constantes
const CHUNK_SIZE = 16;
const RENDER_DISTANCE = 4;
const BLOCK_SIZE = 1;
const GRAVITY = 25;
const PLAYER_SPEED = 15;
const JUMP_SPEED = 10;
const PLAYER_HEIGHT = 1.8;
const PLAYER_WIDTH = 0.6;

// Cache de geometria bunduda
const blockGeometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
const wireframeGeometry = new THREE.BoxGeometry(1.1, 1.1, 1.1);

// Materiais reutilizaveis
const materials = {
  grass: new THREE.MeshStandardMaterial({ color: '#2E8B57' }),
  dirt: new THREE.MeshStandardMaterial({ color: '#8B4513' }),
  stone: new THREE.MeshStandardMaterial({ color: '#808080' }),
  highlight: new THREE.MeshBasicMaterial({ color: 'white', wireframe: true, transparent: true, opacity: 0.5 })
};

const blockTypes = ['grass', 'dirt', 'stone'];

// Componente de Blocos
const Block = React.memo(({ position, type = 'dirt' }) => {
  const meshRef = useRef();
  
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData = { type };
    }
  }, [type]);
  
  return (
    <mesh 
      ref={meshRef}
      position={position}
      geometry={blockGeometry}
      material={materials[type]}
    />
  );
});

// Gerador de Anão Caralahudo
class WorldGenerator {
  static generateHeight(x, z) {
    const freq1 = 0.03;
    const freq2 = 0.08;
    const freq3 = 0.15;
    
    const h1 = Math.sin(x * freq1) * Math.cos(z * freq1) * 8;
    const h2 = Math.sin(x * freq2 + 5) * Math.cos(z * freq2 + 3) * 4;
    const h3 = Math.sin(x * freq3 + 10) * Math.cos(z * freq3 + 7) * 2;
    
    return Math.max(4, Math.floor(Math.abs(h1 + h2 + h3) + 3));
  }

  static generateChunk(chunkX, chunkZ) {
    const blocks = [];
    const worldX = chunkX * CHUNK_SIZE;
    const worldZ = chunkZ * CHUNK_SIZE;
    
    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let z = 0; z < CHUNK_SIZE; z++) {
        const globalX = worldX + x;
        const globalZ = worldZ + z;
        const height = this.generateHeight(globalX, globalZ);
        
        for (let y = 0; y < height; y++) {
          let type = 'dirt';
          if (y === height - 1) {
            type = 'grass';
          } else if (y < 3) {
            type = 'stone';
          }
          
          blocks.push({
            position: [globalX, y, globalZ],
            type: type,
            key: `${globalX},${y},${globalZ}`
          });
        }
      }
    }
    
    return blocks;
  }

  static generateInitialWorld() {
    const allBlocks = [];
    const centerChunk = 0;
    
    for (let x = -RENDER_DISTANCE; x <= RENDER_DISTANCE; x++) {
      for (let z = -RENDER_DISTANCE; z <= RENDER_DISTANCE; z++) {
        const chunkX = centerChunk + x;
        const chunkZ = centerChunk + z;
        const chunkBlocks = this.generateChunk(chunkX, chunkZ);
        allBlocks.push(...chunkBlocks);
      }
    }
    
    return allBlocks;
  }
}

// Loading Screen
function LoadingScreen({ progress, visible }) {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, [visible]);
  
  if (!visible) return null;
  
  return (
    <div className="loading-screen">
      <div className="loading-logo">
        <span className="logo-block">■</span>
        <span className="logo-text">MineClone</span>
        <span className="logo-block">■</span>
      </div>
      <div className="loading-message">Gerando mundo{dots}</div>
      <div className="loading-bar-container">
        <div className="loading-bar">
          <div className="loading-progress" style={{ width: `${progress}%` }} />
        </div>
        <div className="loading-percentage">{Math.round(progress)}%</div>
      </div>
    </div>
  );
}

// Componente do MEU PAU
const World = React.memo(({ blocks }) => {
  const groupRef = useRef();
  
  useEffect(() => {
    if (groupRef.current) {
      window.__blocks = groupRef.current.children;
    }
    return () => { window.__blocks = null; };
  }, [blocks]);
  
  return (
    <group ref={groupRef}>
      {blocks.map((block) => (
        <Block key={block.key} position={block.position} type={block.type} />
      ))}
    </group>
  );
});

// Sistema de colisão favor nunca mais mexer nisso THIAGO
function checkCollision(position, blocks) {
  if (!blocks) return false;
  
  const playerMinY = position.y - PLAYER_HEIGHT;
  const playerMaxY = position.y;
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (!block || !block.position) continue;
    
    const blockPos = block.position;
    
    if (Math.abs(position.x - blockPos.x) > PLAYER_WIDTH + 1) continue;
    if (Math.abs(position.z - blockPos.z) > PLAYER_WIDTH + 1) continue;
    
    const blockMinY = blockPos.y;
    const blockMaxY = blockPos.y + 1;
    
    const overlapX = Math.abs(position.x - blockPos.x) < PLAYER_WIDTH;
    const overlapZ = Math.abs(position.z - blockPos.z) < PLAYER_WIDTH;
    const overlapY = playerMaxY > blockMinY && playerMinY < blockMaxY;
    
    if (overlapX && overlapZ && overlapY) {
      return true;
    }
  }
  
  return false;
}

// Componente do Player 
function Player({ position, setPosition, setTargetBlock, isGameActive }) {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const onGround = useRef(false);
  const keys = useRef({});
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const rayDirection = useMemo(() => new THREE.Vector3(), []);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isGameActive) return;
      if (['KeyW', 'KeyS', 'KeyA', 'KeyD', 'Space'].includes(e.code)) {
        keys.current[e.code] = true;
        e.preventDefault();
      }
    };
    
    const handleKeyUp = (e) => {
      if (!isGameActive) return;
      if (['KeyW', 'KeyS', 'KeyA', 'KeyD', 'Space'].includes(e.code)) {
        keys.current[e.code] = false;
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isGameActive]);
  
  useFrame((state, delta) => {
    if (!document.pointerLockElement || !window.__blocks || !isGameActive) return;
    
    const blocks = window.__blocks;
    
    // Direção da câmera (para frente)
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    
    // Direção da direita (bruh)
    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
    
    // Calcular movimento baseado nas teclas do meu pipi hihi
    let moveX = 0, moveZ = 0;
    
    if (keys.current['KeyW']) {
      moveX += forward.x;
      moveZ += forward.z;
    }
    if (keys.current['KeyS']) {
      moveX -= forward.x;
      moveZ -= forward.z;
    }
    if (keys.current['KeyA']) {
      moveX -= right.x;
      moveZ -= right.z;
    }
    if (keys.current['KeyD']) {
      moveX += right.x;
      moveZ += right.z;
    }
    
    // Aplicar movimento senxual
    if (moveX !== 0 || moveZ !== 0) {
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX = (moveX / length) * PLAYER_SPEED * delta;
      moveZ = (moveZ / length) * PLAYER_SPEED * delta;
      
      const newPosX = position.x + moveX;
      if (!checkCollision(new THREE.Vector3(newPosX, position.y, position.z), blocks)) {
        position.x = newPosX;
      }
      
      const newPosZ = position.z + moveZ;
      if (!checkCollision(new THREE.Vector3(position.x, position.y, newPosZ), blocks)) {
        position.z = newPosZ;
      }
    }
    
    // Pulo
    if (keys.current['Space'] && onGround.current) {
      velocity.current.y = JUMP_SPEED;
      onGround.current = false;
    }
    
    // Gravidade
    velocity.current.y -= GRAVITY * delta;
    
    // Movimento vertical
    const newPosY = position.y + velocity.current.y * delta;
    if (!checkCollision(new THREE.Vector3(position.x, newPosY, position.z), blocks)) {
      position.y = newPosY;
      onGround.current = false;
    } else {
      if (velocity.current.y < 0) {
        onGround.current = true;
      }
      velocity.current.y = 0;
    }
    
    // Atualizar câmera para seguir o player
    camera.position.copy(position);
    
    // Raycast para interação
    camera.getWorldDirection(rayDirection);
    raycaster.set(camera.position, rayDirection);
    raycaster.far = 5;
    
    const intersects = raycaster.intersectObjects(blocks);
    
    if (intersects.length > 0) {
      const hit = intersects[0];
      setTargetBlock({ 
        object: hit.object, 
        point: hit.point,
        face: hit.face.normal.clone()
      });
    } else {
      setTargetBlock(null);
    }
  });
  
  return null;
}

// Componente de Mensagem Mobile (pobres de merda, não tem dinheiro pra comprar um PC, tem que jogar no celular, coitados)
function MobileMessage() {
  return (
    <div className="mobile-message">
      <div className="mobile-message-content">
        <FaDesktop className="desktop-icon" />
        <h2>🚫 EXPERIÊNCIA EXCLUSIVA PARA PC 🚫</h2>
        <p>Infelizmente o MineClone (um clone de minecraft simples) foi desenvolvido apenas para desktop e notebooks.</p>
        <p>Para uma melhor experiência, acesse por um computador com teclado e mouse.</p>
        <div className="mobile-device">
          <FaMobileAlt className="mobile-icon" />
          <span>Dispositivo móvel detectado</span>
        </div>
        <button className="back-button-mobile" onClick={() => window.history.back()}>
          <FaArrowLeft /> Voltar
        </button>
      </div>
    </div>
  );
}

// Função para verificar se colocar um bloco vai causar o bug do limbo, que acontece quando você coloca um bloco exatamente onde seus pés ou cabeça estão, ou muito perto do corpo, fazendo com que o jogo te jogue pro limbo (queda infinita) 
const wouldCauseLimboBug = (newPos, playerPos) => {
  // Posição do jogador em coordenadas de bloco (considerando o tamanho da pika do jogador hihihi)
  const playerBlockX = Math.floor(playerPos.x);
  const playerBlockYFeet = Math.floor(playerPos.y - PLAYER_HEIGHT/2);
  const playerBlockYHead = Math.floor(playerPos.y);
  const playerBlockZ = Math.floor(playerPos.z);
  
  // Verificar se é no mesmo bloco que os pés 
  const sameAsFeet = 
    Math.abs(newPos[0] - playerBlockX) < 0.1 &&
    Math.abs(newPos[1] - playerBlockYFeet) < 0.1 &&
    Math.abs(newPos[2] - playerBlockZ) < 0.1;
  
  // Verificar se é no mesmo bloco que a cabeça (na de cima, não a de baixo)
  const sameAsHead = 
    Math.abs(newPos[0] - playerBlockX) < 0.1 &&
    Math.abs(newPos[1] - playerBlockYHead) < 0.1 &&
    Math.abs(newPos[2] - playerBlockZ) < 0.1;
  
  // Verificar distância muito próxima
  const distance = Math.sqrt(
    Math.pow(newPos[0] - playerPos.x, 2) + 
    Math.pow(newPos[1] - playerPos.y, 2) + 
    Math.pow(newPos[2] - playerPos.z, 2)
  );
  
  const tooClose = distance < 0.8;
  
  // Verificar se está no mesmo X/Z mas altura diferente (cairia)
  const sameXZ = 
    Math.abs(newPos[0] - playerBlockX) < 0.1 &&
    Math.abs(newPos[2] - playerBlockZ) < 0.1;
  
  return {
    willBug: sameAsFeet || sameAsHead || tooClose || (sameXZ && distance < 1.5),
    reason: sameAsFeet ? "mesmo bloco dos pés" : 
            sameAsHead ? "mesmo bloco da cabeça" : 
            tooClose ? "muito perto" : 
            (sameXZ && distance < 1.5) ? "mesmo X/Z" : "nenhum"
  };
};

// Componente Principal
function MineClone() {
  const navigate = useNavigate();
  const [playerPosition] = useState(() => new THREE.Vector3(0, 50, 0));
  const positionRef = useRef(playerPosition);
  const [targetBlock, setTargetBlock] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [worldBlocks, setWorldBlocks] = useState([]);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detectar se é mobile (pobre)
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobileDevice = mobileRegex.test(userAgent);
    
    // Verificar tambem pela largura de meu pau
    const isSmallScreen = window.innerWidth <= 768;
    
    setIsMobile(isMobileDevice || isSmallScreen);
  }, []);
  
  // Gerar mundo enquanto rebola lentinho pros crias
  useEffect(() => {
    if (isMobile) return; // Não gerar mundo se for mobile (bua bua)
    
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => Math.min(prev + 2, 95));
    }, 30);
    
    setTimeout(() => {
      const blocks = WorldGenerator.generateInitialWorld();
      setWorldBlocks(blocks);
      setLoadingProgress(100);
      clearInterval(progressInterval);
      
      setTimeout(() => {
        setGameStarted(true);
      }, 500);
    }, 100);
    
    return () => clearInterval(progressInterval);
  }, [isMobile]);
  
  // Quebrar bloco (clique esquerdo) (bruh)
  const handleBreakBlock = useCallback(() => {
    if (!isGameActive) return;
    if (targetBlock && targetBlock.object && targetBlock.object.parent) {
      targetBlock.object.parent.remove(targetBlock.object);
      setTargetBlock(null);
    }
  }, [targetBlock, isGameActive]);
  
  // Colocar bloco (clique direito) - SISTEMA PREVENTIVO (agora vai caralho)
  const handlePlaceBlock = useCallback(() => {
    if (!isGameActive || !targetBlock || !targetBlock.object || !targetBlock.face) return;
    
    try {
      const blockPos = targetBlock.object.position.clone();
      const face = targetBlock.face;
      
      // Arredondar a face para valores inteiros (pra não dar merda)
      const faceX = Math.round(face.x);
      const faceY = Math.round(face.y);
      const faceZ = Math.round(face.z);
      
      // Calcular posição do novo bloco (adjacente à face)
      const newPos = [
        blockPos.x + faceX,
        blockPos.y + faceY,
        blockPos.z + faceZ
      ];
      
      // Verificar se colocar o bloco nessa posição causaria o bug do limbo (se não, a gente agradece a Deus, porquê eu não sei mais o que fazer)
      const limboCheck = wouldCauseLimboBug(newPos, positionRef.current);
      
      if (limboCheck.willBug) {
        return; 
      }
      
      // Verificar se já existe um bloco nessa posição
      let exists = false;
      if (window.__blocks) {
        for (let block of window.__blocks) {
          if (block.position) {
            const dx = Math.abs(block.position.x - newPos[0]);
            const dy = Math.abs(block.position.y - newPos[1]);
            const dz = Math.abs(block.position.z - newPos[2]);
            
            if (dx < 0.1 && dy < 0.1 && dz < 0.1) {
              exists = true;
              break;
            }
          }
        }
      }
      
      // Verificar distância máxima 
      const distanceToPlayer = Math.sqrt(
        Math.pow(newPos[0] - positionRef.current.x, 2) + 
        Math.pow(newPos[1] - positionRef.current.y, 2) + 
        Math.pow(newPos[2] - positionRef.current.z, 2)
      );
      
      if (distanceToPlayer > 6) {
        return;
      }
      
      // TUDO OK - Pode colocar o bloco no ânus 
      if (!exists) {
        const newBlock = {
          position: newPos,
          type: blockTypes[currentBlockIndex],
          key: `${newPos[0]},${newPos[1]},${newPos[2]}-${Date.now()}`
        };
        
        setWorldBlocks(prev => [...prev, newBlock]);
      } else {
      }
    } catch (error) {
      console.error("Erro ao colocar bloco:", error);
    }
  }, [targetBlock, currentBlockIndex, isGameActive]);
  
  // Eventos de clique
  useEffect(() => {
    const handleClick = (e) => {
      if (!gameStarted || !isGameActive) return;
      
      if (e.button === 0) {
        handleBreakBlock();
      } else if (e.button === 2) {
        e.preventDefault();
        e.stopPropagation();
        handlePlaceBlock();
      }
    };
    
    const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [handleBreakBlock, handlePlaceBlock, gameStarted, isGameActive]);
  
  // Trocar tipo de bloco (teclas 1, 2, 3)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted || !isGameActive) return;
      
      if (e.code === 'Digit1') setCurrentBlockIndex(0);
      if (e.code === 'Digit2') setCurrentBlockIndex(1);
      if (e.code === 'Digit3') setCurrentBlockIndex(2);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, isGameActive]);
  
  // Pointer lock
  useEffect(() => {
    const handlePointerLockChange = () => {
      setIsPointerLocked(document.pointerLockElement !== null);
      if (!document.pointerLockElement) {
        setIsGameActive(false);
      }
    };
    
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => document.removeEventListener('pointerlockchange', handlePointerLockChange);
  }, []);
  
  // Função para iniciar o jogo (clique na tela)
  const handleCanvasClick = useCallback(() => {
    if (!isPointerLocked && !isMobile) {
      document.body.requestPointerLock();
      setIsGameActive(true);
    }
  }, [isPointerLocked, isMobile]);
  
  // Mensagem de boas-vindas ao meu inferno (só mostrar por 8 segundos)
  useEffect(() => {
    if (gameStarted) {
      const timer = setTimeout(() => setShowWelcome(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [gameStarted]);
  
  // Sistema de resgaste do Limbo, onde eu espero não precisar de porra
  useEffect(() => {
    const checkLimbo = setInterval(() => {
      if (isGameActive && positionRef.current.y < -5) {
        positionRef.current.y = 50;
        positionRef.current.x = 0;
        positionRef.current.z = 0;
      }
    }, 1000);
    
    return () => clearInterval(checkLimbo);
  }, [isGameActive]);
  
  // Se for mobile, mostra mensagem de que você é um pobre de merda e não pode jogar MineClone, assim, sei que não é nenhum dark souls, mas tem que ter autoestima, né? E não adianta tentar jogar no celular, porquê o jogo foi feito pra PC, então é isso, se for mobile, só mostra a mensagem e um botão de voltar, simples assim, sem complicação, sem mimimi.
  if (isMobile) {
    return <MobileMessage />;
  }
  
  return (
    <div className={`minecraft-container ${isPointerLocked ? 'pointer-locked' : ''}`}>
      <LoadingScreen progress={loadingProgress} visible={!gameStarted} />
      
      {gameStarted && (
        <div className="minecraft-hud">
          <div className="coordinates-panel">
            <div className="panel-header">
                {/* Sim, eu preferi fazer um botão de voltar do zero, não sei o por quê*/}
                   <button 
                className='back-button' 
                onClick={() => navigate(-1)}
                style={{ pointerEvents: 'auto' }}
              >
                <FaArrowLeft />
              </button>
              <div className="minecraft-icon" />
              <h3>POSIÇÃO</h3>
            </div>
            
            <div className="coord-row x">
              <span className="coord-icon">X</span>
              <span className="coord-label">EIXO X</span>
              <span className="coord-value">{positionRef.current.x.toFixed(1)}</span>
            </div>
            
            <div className="coord-row y">
              <span className="coord-icon">Y</span>
              <span className="coord-label">EIXO Y</span>
              <span className="coord-value">{positionRef.current.y.toFixed(1)}</span>
            </div>
            
            <div className="coord-row z">
              <span className="coord-icon">Z</span>
              <span className="coord-label">EIXO Z</span>
              <span className="coord-value">{positionRef.current.z.toFixed(1)}</span>
            </div>
            
            <div className="selected-block-section">
              <div className="block-display">
                <div 
                  className="block-icon" 
                  style={{ 
                    background: currentBlockIndex === 0 ? '#2E8B57' : 
                               currentBlockIndex === 1 ? '#8B4513' : '#808080' 
                  }} 
                />
                <div className="block-info">
                  <div className="block-label">BLOCO SELECIONADO</div>
                  <div className="block-name">{blockTypes[currentBlockIndex]}</div>
                  <div className="block-controls">
                    <span className="block-key">1</span>
                    <span className="block-key">2</span>
                    <span className="block-key">3</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="world-info">
              <div className="world-stats">
                <div className="world-stat">
                  <span className="stat-icon">🗺️</span>
                  <span className="stat-value">{(RENDER_DISTANCE*2+1)**2} chunks</span>
                </div>
                <div className="world-stat">
                  <span className="stat-icon">⚡</span>
                  <span className="stat-value">60 FPS</span>
                </div>
              </div>
            </div>
            
            <div className="panel-footer">
              <div className="esc-hint">
                <kbd>ESC</kbd> PAUSAR
              </div>
            </div>
          </div>
          
          <div className="crosshair">
            <div className="crosshair-center" />
            <div className="crosshair-line horizontal" />
            <div className="crosshair-line vertical" />
          </div>
          
          {!isPointerLocked && (
            <div className="game-message" style={{ top: '200px' }}>
              🔒 Clique no centro da tela para jogar
            </div>
          )}
          
          {showWelcome && isPointerLocked && (
            <div className="game-message">
              WASD: mover | Espaço: pular | Clique: quebrar | Direito: colocar
            </div>
          )}
        </div>
      )}
      
      {gameStarted && (
        <Canvas
          style={{ background: '#000033', cursor: isPointerLocked ? 'none' : 'default' }}
          camera={{ position: [0, 50, 0] }}
          gl={{ 
            antialias: true,
            powerPreference: "high-performance"
          }}
          onClick={handleCanvasClick}
          onContextMenu={(e) => e.preventDefault()}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 20, 10]} intensity={1.2} />
          <directionalLight position={[-10, 10, -10]} intensity={0.5} />
          
          <Stars radius={100} depth={50} count={1000} factor={4} />
          
          <World blocks={worldBlocks} />
          
          <Player 
            position={positionRef.current}
            setPosition={(newPos) => { positionRef.current = newPos; }}
            setTargetBlock={setTargetBlock}
            isGameActive={isGameActive}
          />
          
          {targetBlock && (
            <mesh position={targetBlock.object.position} geometry={wireframeGeometry} material={materials.highlight} />
          )}
          
          <PointerLockControls />
        </Canvas>
      )}
    </div>
  );
}

export default MineClone;