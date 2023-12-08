import {makeL2, makeL, Piece, makeS, makeT, makeCube, makeBar, makeZ, randomPiece, rotate2D} from "./piece.js"

class Scene {
    reset(width, height) {
        this.width = width;
        this.height = height;
        this.grid = {}
        this.currentPiece = this.insertPiece(randomPiece(this));
        this.game = document.getElementById("game");
        this.backgroundCanvas = document.createElement('canvas');
        this.backgroundCanvas.width = this.game.offsetWidth;
        this.backgroundCanvas.height = this.game.offsetHeight;
        this.backgroundCanvas.style.position = 'absolute';
        this.backgroundCanvasCtx = this.backgroundCanvas.getContext("2d");
        this.game.appendChild(this.backgroundCanvas)

    }

    /**
     * @param piece {Piece}
     */
    insertPiece(piece) {
        piece.moveTo({x: this.width / 2, y: this.height})
        return piece;
    }

    movePiece() {
        if (this.currentPiece) {
            const newPosition = {x: this.currentPiece.position.x, y: this.currentPiece.position.y - 1};
            if (this.canMovePieceToPosition(this.currentPiece, newPosition)) {
                this.currentPiece.moveTo(newPosition);
            } else {
                this.placePiece(this.currentPiece);
                this.checkAndMoveLines();
                this.currentPiece = this.insertPiece(randomPiece(this));
            }
        }
    }

    placePiece(piece) {
        const cellSize = {
            x: (piece.canvas.offsetWidth / piece.scene.width),
            y: (piece.canvas.offsetHeight / piece.scene.height)
        }

        const correctionOffset = rotate2D({x: cellSize.x, y: cellSize.y}, piece.rotation);
        const translation = {
            x: piece.position.x * cellSize.x + cellSize.x / 2 - correctionOffset.x / 2,
            y: piece.canvas.offsetHeight - piece.position.y * cellSize.y + cellSize.y / 2 - correctionOffset.y / 2,
        }
        this.backgroundCanvasCtx.translate(translation.x, translation.y);
        this.backgroundCanvasCtx.rotate(piece.rotation * Math.PI / 2);
        this.backgroundCanvasCtx.drawImage(piece.image, 0, 0, piece.width * (this.game.offsetWidth / this.width), piece.height * this.game.offsetHeight / this.height);
        this.backgroundCanvasCtx.rotate(-piece.rotation * Math.PI / 2);
        this.backgroundCanvasCtx.translate(-translation.x, -translation.y);
        this.currentPiece.destroy();

        for (const elem of piece.elementsWorldLocation()) {
            if (!this.grid[piece.position.y - elem.y])
                this.grid[piece.position.y - elem.y] = {};
            this.grid[piece.position.y - elem.y][elem.x + piece.position.x] = true;
        }
    }

    checkAndMoveLines() {
        for (let y = this.height - 1; y >= 0; --y) {
            if (!this.grid[y])
                continue;

            let full = true;
            for (let x = 0; x < this.width; ++x) {
                if (!this.grid[y][x]) {
                    full = false;
                    break;
                }
            }

            // Move everything upside
            if (full) {

                const data = this.backgroundCanvasCtx.getImageData(0, 0, this.game.offsetWidth, this.game.offsetHeight - this.game.offsetHeight / this.height * y);

                this.backgroundCanvasCtx.clearRect(0, 0, this.game.offsetWidth, this.game.offsetHeight - this.game.offsetHeight / this.height * (y - 1));
                this.backgroundCanvasCtx.putImageData(data, 0, this.game.offsetHeight / this.height);

                console.log("WOUHOU x10")
                for (let u = y + 1; u < this.height; ++u) {
                    if (!this.grid[u])
                        continue;
                    if (!this.grid[u - 1])
                        this.grid[u - 1] = {}
                    for (let x = 0; x < this.width; ++x)
                        this.grid[u - 1][x] = this.grid[u][x];
                    delete this.grid[u];
                }
            }
        }
    }

    canMovePieceToPosition(piece, newPosition) {
        const oldPosition = piece.position;
        let canMove = true;
        piece.moveTo(newPosition);
        for (const elem of piece.elementsWorldLocation()) {
            if (this.isLocationTaken({x: elem.x + newPosition.x, y: newPosition.y - elem.y})) {
                canMove = false;
                break;
            }
        }
        piece.moveTo(oldPosition);
        return canMove;
    }

    isLocationTaken(position) {
        if (position.x < 0 || position.x >= this.width || position.y <= 0)
            return true;

        if (this.grid[position.y] && this.grid[position.y][position.x])
            return true;

        return false;
    }
}


export {Scene};