function rotate2D(position, theta) {
    return {
        x: Math.round(position.x * Math.cos(theta * Math.PI / 2) - position.y * Math.sin(theta * Math.PI / 2)),
        y: Math.round(position.x * Math.sin(theta * Math.PI / 2) + position.y * Math.cos(theta * Math.PI / 2))
    }
}

class Piece {
    constructor(elements, center, image, scene) {
        this.elements = elements;
        this.center = center;
        this.position = {x: 0, y: 0}
        this.rotation = 0;
        this.scene = scene;
        this.canvas = document.getElementById("game");

        this.width = 0;
        this.height = 0;
        for (const element of this.elements) {
            if (element.x + 1 > this.width)
                this.width = element.x + 1;
            if (element.y + 1 > this.height) {
                this.height = element.y + 1;
            }
        }

        this.image = document.createElement("img");
        this.image.src = image;
        this.image.style.position = "absolute"
        this.image.style.width = `${this.width * (this.canvas.offsetWidth / this.scene.width)}px`
        this.canvas.appendChild(this.image);
    }

    moveTo(newPosition) {
        this.position = newPosition;
        this.updateRendering();
    }

    rotate(count) {
        this.rotation += count;
        this.updateRendering();
    }

    getImageTranslation() {
        const cellSize = {
            x: (this.canvas.offsetWidth / this.scene.width),
            y: (this.canvas.offsetHeight / this.scene.height)
        }

        const imageCenter = {
            x: (this.width - 1) * cellSize.x / 2,
            y: (this.height - 1) * cellSize.y / 2
        };
        const turnedImageCenter = rotate2D(imageCenter, this.rotation);

        return {
            x: (this.position.x) * cellSize.x - imageCenter.x + turnedImageCenter.x,
            y: this.canvas.offsetHeight - this.position.y * cellSize.y - imageCenter.y + turnedImageCenter.y
        }
    }

    updateRendering() {
        const imageTransform = this.getImageTranslation();
        this.image.style.transform = `translate(${imageTransform.x}px, ${imageTransform.y}px) rotate(${this.rotation * 90}deg)`;
    }

    destroy() {
        this.image.remove();
    }

    elementsWorldLocation() {
        const elements = []
        for (const element of this.elements) {
            const turnedElement = rotate2D(element, this.rotation);
            elements.push(turnedElement)
        }
        return elements;
    }
}

function makeBar(scene) {
    return new Piece([{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}], {x: 2, y: 0}, "images/Bar.png", scene);
}

function makeCube(scene) {
    return new Piece([{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}], {x: 0, y: 0}, "images/Cube.png", scene);
}

function makeL(scene) {
    return new Piece([{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 2, y: 1}], {x: 1, y: 0}, "images/L.png", scene);
}

function makeL2(scene) {
    return new Piece([{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 2, y: 0}], {x: 1, y: 0}, "images/L2.png", scene);
}

function makeS(scene) {
    return new Piece([{x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 2, y: 0}], {x: 1, y: 0}, "images/S.png", scene);
}

function makeZ(scene) {
    return new Piece([{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}], {x: 1, y: 0}, "images/Z.png", scene);
}

function makeT(scene) {
    return new Piece([{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 0}], {x: 1, y: 0}, "images/T.png", scene);
}

function randomPiece(scene) {
    const functions = [makeBar, makeCube, makeT, makeS, makeL, makeL2, makeZ]
    return functions[Math.floor(Math.random() * functions.length)](scene);
}

export {Piece, makeBar, makeCube, makeT, makeS, makeL, makeL2, makeZ, randomPiece, rotate2D}