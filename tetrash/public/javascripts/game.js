import {Scene} from "./scene.js"

const gameCanvas = document.getElementById("game")
const nextImage = document.getElementById("next")

let points = 0;
let finished = false;

function nextCallback(next) {
    nextImage.src = next.image.src
}

document.getElementById("sendHighscore").onclick = () => {
    let name = document.getElementById("name").value;
    console.log(name)
    if (name && name.length > 0) {
        fetch('/404/', {
            method: 'POST',
            redirect: 'follow',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({"name": name, "score": points})
        });
    }
}

function destroyLineCallback() {
    points += 10;
    document.getElementById("score").innerText = `Vous avez recyclé ${points} tonnes de déchets !!!`;
}

function loseCallback() {
    if (points >= 10) {
        console.log("BRAVO VOUS AVEZ SAUVE LA PLANETE");
        document.getElementById("winOverlay").style.display = "flex";
        finished = true;
    }
    else {
        console.log("PERDUUU");
        finished = true;
        window.location.href = "/404";
    }
}

const scene = new Scene(destroyLineCallback, loseCallback, nextCallback);

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

    if (lastMoveTime > 200 && !finished) {
        lastMoveTime = 0;
        scene.movePiece();
    }

    window.requestAnimationFrame(updateGame)
}

document.addEventListener('keydown', (event) => {
    if (finished)
        return;
    switch (event.key) {
        case 'ArrowDown':
            scene.movePiece();
            break;
        case 'ArrowUp':
            scene.currentPiece.rotate(1);
            if (!scene.canMovePieceToPosition(scene.currentPiece, scene.currentPiece.position)) {
                scene.currentPiece.rotate(-1);
            }
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

