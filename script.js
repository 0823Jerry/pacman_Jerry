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
const enemies = []; 
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

const marks = document.querySelector(".score")
let scores = 0

class Ball{
    constructor(pos, radius){
        this.pos = pos
        this.radius = radius
        this.color = "yellow"
    }
    draw(){
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color;
        ctx.fill()
        ctx.closePath()
    }
}
class Enemy extends Ball{
    constructor(pos, radius){
        super(pos, radius)
        this.direction = 'right'
        this.speed = 2
        this.previousX = this.pos.x
        this.previousY = this.pos.y
    }
    move(){
        this.previousX = this.pos.x
        this.previousY = this.pos.y
        if(this.direction == 'right'){
            this.pos.x += this.speed
        }
        else if(this.direction == 'left'){
            this.pos.x -= this.speed
        }
        else if(this.direction == 'up'){
            this.pos.y -= this.speed
        }
        else{
            this.pos.y += this.speed
        }
        for(let i in boundaries){
            if(isTouching(this.pos.x - this.radius, 
                this.pos.x + this.radius, 
                boundaries[i].pos.x, 
                boundaries[i].pos.x + blockSize, 
                this.pos.y - this.radius, 
                this.pos.y + this.radius,
                boundaries[i].pos.y,
                boundaries[i].pos.y + blockSize)){
                this.pos.x = this.previousX
                this.pos.y = this.previousY
                let A = Math.floor(Math.random() * 4)
                if(A == 0){
                    this.direction = 'up'
                }
                else if(A == 1){
                    this.direction = 'down'
                }
                else if(A == 2){
                    this.direction = 'left'
                }
                else{
                    this.direction = 'right'
                }
                console.log(A, this.direction)
            }
        }
}
}
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

class Food extends Ball{
    constructor(pos, radius){
        super(pos, radius)
    }
    
}

class Player extends Ball{
    constructor(pos, radius){
        super(pos, radius)
        this.direction = 'right'
        this.nextDirection = ''
        this.speed = 2
        this.previousX = this.pos.x
        this.previousY = this.pos.y
    }
    
    move(){
        this.previousX = this.pos.x
        this.previousY = this.pos.y
        if(this.direction == 'right'){
            this.pos.x += this.speed
        }
        else if(this.direction == 'left'){
            this.pos.x -= this.speed
        }
        else if(this.direction == 'up'){
            this.pos.y -= this.speed
        }
        else{
            this.pos.y += this.speed
        }
        for(let i in boundaries){
            if(isTouching(this.pos.x - this.radius, 
                this.pos.x + this.radius, 
                boundaries[i].pos.x, 
                boundaries[i].pos.x + blockSize, 
                this.pos.y - this.radius, 
                this.pos.y + this.radius,
                boundaries[i].pos.y,
                boundaries[i].pos.y + blockSize)){
                this.pos.x = this.previousX
                this.pos.y = this.previousY
            }
        }
        for(let i in foods){
            if(isTouching(this.pos.x - this.radius, 
                this.pos.x + this.radius, 
                foods[i].pos.x - foods[i].radius,
                foods[i].pos.x + foods[i].radius, 
                this.pos.y - this.radius, 
                this.pos.y + this.radius,
                foods[i].pos.y - foods[i].radius,
                foods[i].pos.y + foods[i].radius)){
                foods.splice(i, 1)
                scores += 1
                marks.textContent = `Score: ${scores}`
            }
        }
    }
    changeDirection(){
        if(this.nextDirection && this.direction != this.nextDirection){
            if(this.nextDirection == 'up'){
                this.canChange(0, 0 - blockSize / 2)
            }else if(this.nextDirection == 'down'){
                this.canChange(0, blockSize / 2)
            }else if(this.nextDirection == 'right'){
                this.canChange(blockSize / 2, 0)
            }else{
                this.canChange(0 - blockSize / 2, 0)
            }
    }
    }
    canChange(x, y){
        for(let i in boundaries){
            if(isTouching(this.pos.x - this.radius + x, 
                this.pos.x + this.radius + x, 
                boundaries[i].pos.x, 
                boundaries[i].pos.x + blockSize, 
                this.pos.y - this.radius + y, 
                this.pos.y + this.radius + y,
                boundaries[i].pos.y,
                boundaries[i].pos.y + blockSize)){
                    return
            }
        }
        this.direction = this.nextDirection
        this.nextDirection = ''
    }
}

function isTouching(x1, x2, x3, x4, y1, y2, y3, y4){
    return x2 >= x3 && x1 <= x4 && y2 >= y3 && y1 <= y4
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

    for(let m in enemies){
        enemies[m].draw()
        enemies[m].move()
    }

    player.draw()
    player.move()
    player.changeDirection()
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

for(var B = 0; B < 3; B++){
    enemies.push(new Enemy({x: blockSize* 3 + blockSize / 2, y: blockSize*3 + blockSize / 2}, blockSize / 3))
}

const player = new Player({x: blockSize + blockSize / 2, y: blockSize + blockSize / 2}, blockSize / 3)
document.addEventListener('keydown', (e) => {
    if(e.key == 'w'){
        player.nextDirection = 'up'
    }
    if(e.key == 'a'){
        player.nextDirection = 'left'
    }
    if(e.key == 's'){
        player.nextDirection = 'down'
    }
    if(e.key == 'd'){
        player.nextDirection = 'right'
    }
})
setInterval(draw, 1000 / fps)

