// Minimal Flappy Bird logic for the embedded HTML
(function () {
  const gameContainer = document.querySelector('.game-container');
  const sky = document.querySelector('.sky');
  const bird = document.querySelector('.bird');
  const ground = document.querySelector('.ground-moving');

  if (!gameContainer || !sky || !bird || !ground) return;

  const containerWidth = 500;
  const containerHeight = 730;
  const skyHeight = 580;

  let birdLeft = 50;
  let birdBottom = 200;
  let gravity = 2;
  let isGameOver = false;
  let gap = 150; // gap between top/bottom pipes

  // Apply starting position
  function updateBirdPosition() {
    bird.style.left = birdLeft + 'px';
    bird.style.top = birdBottom + 'px';
  }

  // Jump handler
  function jump() {
    if (isGameOver) return;
    if (birdBottom < skyHeight - 60) {
      birdBottom += 40;
      updateBirdPosition();
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      jump();
    }
  });
  document.addEventListener('click', jump);

  // Gravity loop
  const gravityTimer = setInterval(() => {
    if (isGameOver) return;
    birdBottom -= gravity;
    if (birdBottom < 0) birdBottom = 0;
    updateBirdPosition();
  }, 20);

  // Pipe creation
  function createObstacle() {
    if (isGameOver) return;
    const obstacleLeftStart = containerWidth;
    const randomHeight = Math.floor(Math.random() * 200) + 100; // height of bottom pipe
    const bottomPipeHeight = randomHeight;
    const topPipeHeight = skyHeight - bottomPipeHeight - gap;

    const obstacleBottom = document.createElement('div');
    const obstacleTop = document.createElement('div');

    obstacleBottom.classList.add('obstacle-bottom');
    obstacleTop.classList.add('obstacle-top');

    Object.assign(obstacleBottom.style, {
      position: 'absolute',
      left: obstacleLeftStart + 'px',
      bottom: '0px',
      width: '60px',
      height: bottomPipeHeight + 'px',
      background: '#5ab552',
      border: '3px solid #3c8f38',
      boxSizing: 'border-box',
    });

    Object.assign(obstacleTop.style, {
      position: 'absolute',
      left: obstacleLeftStart + 'px',
      top: '0px',
      width: '60px',
      height: topPipeHeight + 'px',
      background: '#5ab552',
      border: '3px solid #3c8f38',
      boxSizing: 'border-box',
    });

    sky.appendChild(obstacleBottom);
    sky.appendChild(obstacleTop);

    let obstacleLeft = obstacleLeftStart;
    const speed = 3;

    const moveTimer = setInterval(() => {
      if (isGameOver) {
        clearInterval(moveTimer);
        obstacleBottom.remove();
        obstacleTop.remove();
        return;
      }

      obstacleLeft -= speed;
      obstacleBottom.style.left = obstacleLeft + 'px';
      obstacleTop.style.left = obstacleLeft + 'px';

      // Remove when off-screen
      if (obstacleLeft < -60) {
        clearInterval(moveTimer);
        obstacleBottom.remove();
        obstacleTop.remove();
      }

      // Collision detection
      const birdRight = birdLeft + 40; // approx bird width
      const birdTop = birdBottom + 30; // approx bird height

      const withinPipeX = obstacleLeft < birdRight && obstacleLeft + 60 > birdLeft;
      const hitBottomPipe = birdBottom <= bottomPipeHeight && withinPipeX;
      const hitTopPipe = birdTop >= skyHeight - topPipeHeight && withinPipeX;

      if (hitBottomPipe || hitTopPipe) {
        gameOver();
      }
    }, 20);

    // Queue next obstacle
    setTimeout(createObstacle, 1500 + Math.random() * 1000);
  }

  function gameOver() {
    if (isGameOver) return;
    isGameOver = true;
    ground.style.animationPlayState = 'paused';
    // Simple overlay
    const overlay = document.createElement('div');
    overlay.textContent = 'Game Over - click to restart';
    Object.assign(overlay.style, {
      position: 'absolute',
      inset: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontFamily: 'sans-serif',
      fontSize: '22px',
      background: 'rgba(0,0,0,0.4)'
    });
    gameContainer.appendChild(overlay);
    overlay.addEventListener('click', () => window.location.reload());
  }

  // Start
  updateBirdPosition();
  createObstacle();
})();
















