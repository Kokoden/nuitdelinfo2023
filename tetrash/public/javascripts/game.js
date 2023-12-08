import {Scene} from "./scene.js"

const gameCanvas = document.getElementById("game")
const scene = new Scene();

function initGame() {
    scene.reset(10, 20);

    updateGame();
}

let lastTime = Date.now();
let lastMoveTime = 0;

function updateGame() {
    // Compute dleta time
    const now = Date.now();
    const deltaTime = now - lastTime;
    lastTime = now;

    lastMoveTime += deltaTime;

    if (lastMoveTime > 200) {
        lastMoveTime = 0;
        scene.movePiece();
    }

    window.requestAnimationFrame(updateGame)
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowDown':
            scene.movePiece();
            break;
        case 'ArrowUp':
            scene.currentPiece.rotate(1);
            break;
        case 'ArrowLeft':
            const newPos = {x: scene.currentPiece.position.x - 1, y: scene.currentPiece.position.y};
            if (scene.canMovePieceToPosition(scene.currentPiece, newPos))
                scene.currentPiece.moveTo(newPos);
            break;
        case 'ArrowRight':
            const newPos2 = {x: scene.currentPiece.position.x + 1, y: scene.currentPiece.position.y};
            if (scene.canMovePieceToPosition(scene.currentPiece, newPos2))
                scene.currentPiece.moveTo(newPos2);
            break;
    }
}, false);

initGame()

