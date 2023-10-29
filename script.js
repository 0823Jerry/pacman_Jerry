const textToImg = {
    '-' : './images/pipeHorizontal.png',
    '|' : './images/pipeVertical.png',
    '1' : './images/pipeCorner1.png',
    '2' : './images/pipeCorner2.png',
    '3' : './images/pipeCorner3.png',
    '4' : './images/pipeCorner4.png',
    'b' : './images/block.png',
    '[' :  './images/capLeft.png',
    ']' : './images/capRight.png',
    '_' : './images/capBottom.png',
    '^' : './images/capTop.png',
    '+' : './images/pipeCross.png',
    '5' : './images/pipeConnectorTop.png',
    '6' : './images/pipeConnectorRight.png',
    '7' : './images/pipeConnectorBottom.png',
    '8' : './images/pipeConnectorLeft.png'
}

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const fps = 50;
const blockSize = 50;
const boundaries = [];
const foods = [];
const map = [['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
             ['|', '.', '.', '.', '.', '.', '.', '|', '.', '.', '.', '|'],
             ['|', '.', '^', '.', '^', '.', '.', '|', '.', '^', '.', '|'],
             ['|', '.', '|', '.', '4', '2', '.', '|', '.', '|', '.', '|'],
             ['|', '.', '|', '.', '.', '|', '.', '|', '.', '|', '.', '|'],
             ['|', '.', '|', '.', '[', '3', '.', '_', '.', '|', '.', '|'],
             ['|', '.', '|', '.', '.', '.', '.', '.', '.', '|', '.', '|'],
             ['|', '.', '4', '-', '-', '-', '-', ']', '.', '|', '.', '|'],
             ['|', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|'],
             ['|', '.', 'b', '.', '[', '-', '-', '2', '.', '_', '.', '|'],
             ['|', '.', '.', '.', '.', '.', '.', '|', '.', '.', '.', '|'],
             ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']];
canvas.width = map[0].length * blockSize;
canvas.height = map.length * blockSize;

class Boundary{
    constructor(pos, src){
        this.pos = pos
        this.img = new Image(blockSize, blockSize)
        this.img.src = src
    }
    draw(){
        ctx.drawImage(this.img, this.pos.x, this.pos.y, blockSize, blockSize)
    }
}

class Food{
    constructor(pos, radius){
        this.pos = pos
        this.radius = radius
    }
    draw(){
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'yellow';
        ctx.fill()
        ctx.closePath()
    }
}

for(let i in map){
    for(let j in map[i]){
        if(map[i][j] != '.'){
        boundaries.push(new Boundary({x:blockSize * j, y:blockSize * i}, textToImg[map[i][j]]))
        }
        else{
        foods.push(new Food({x: blockSize * j + blockSize / 2, y: blockSize * i + blockSize / 2}, blockSize / 10))
        }
    }
}
function draw(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, map[0].length * blockSize, map.length * blockSize);
    for(let k in boundaries){
        boundaries[k].draw()
    }

    for(let l in foods){
        foods[l].draw()
    }
}

setInterval(draw, 1000 / fps)