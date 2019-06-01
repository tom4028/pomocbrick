const container = document.querySelector('.container');
const conDim = container.getBoundingClientRect();
console.log("conDim",conDim);
const gameOver = document.createElement('div');
gameOver.textContent = "Start Game";
gameOver.style.position = "absolute";
gameOver.style.color="white";
gameOver.style.lineHeight = "60px";
gameOver.style.height = "250px";
gameOver.style.textAlign = "center";
gameOver.style.fontSize = "3em";
gameOver.style.textTransform = "uppercase";
gameOver.style.backgroundColor ="red";
gameOver.style.width="100%";
gameOver.addEventListener('click',startGame);
container.appendChild(gameOver);

// Create ball
const ball = document.createElement('div');
ball.style.position = "absolute";
ball.style.width="20px";
ball.style.height="20px";
ball.style.backgroundColor = "white";
ball.style.borderRadius ="25px";
ball.style.backgroundImage="url('ball.png')";
ball.backgroundSize = "20px 20px";
ball.style.top="70%";
ball.style.left = "50%";
ball.style.display = "none";
container.appendChild(ball);

//Create paddle
const paddle = document.createElement('div');
paddle.style.position = 'absolute';
paddle.style.backgroundColor = "white";
paddle.style.height ="20px";
paddle.style.width = "100px";
paddle.style.borderRadius = "25px";
paddle.style.bottom = "30px";
paddle.style.left = "50%";
container.appendChild(paddle);


document.addEventListener('keydown',function(e){
    console.log(e.keyCode);
    if(e.keyCode ===37){
        paddle.left = true;
    }
    if(e.keyCode ===39){
        paddle.right = true;
    }
})
document.addEventListener('keyup',function(e){
    console.log(e.keyCode);
    if(e.keyCode ===37){
        paddle.left = false;
    }
    if(e.keyCode ===39){
        paddle.right = false;
    }
    if(e.keyCode === 38 && !player.inPlay){
        player.inPlay = true;
    }
})


const player = {
    gameover:true
}



function startGame(){
    console.log("start");
    console.log(conDim);
    if(player.gameover){
        player.gamover = false;
        gameOver.style.display = "none";
        player.score = 0;
        player.lives =3;
        player.inPlay = false;
        ball.style.display= "block";
        ball.style.left = paddle.offsetLeft + 50 +'px';
        ball.style.top = paddle.offsetTop - 30 +"px";
        player.ballDir=[2,-5];
        player.num = 30;
        //setup bricks
        setupBricks(player.num);
        scoreUpdater();
        player.ani = window.requestAnimationFrame(update);
    }
    
}

function setupBricks(num){
    let row = {
        x:(conDim.width %100)/2,
        y:50
    }
    let skip = false;
    for(let x=0;x<num;x++){
        console.log(row);
        if(row.x > (conDim.width-100)){
            row.y+=50;
            if(row.y >(conDim.height/2)){
                skip = true;
            }
            row.x = ((conDim.width %100)/2);
        }
        row.count = x;
        //createBrick
        if(!skip){
            createBrick(row);
        }
        
        row.x+=100;
    }
}

function createBrick(pos){
    const div = document.createElement('div');
    div.setAttribute('class','brick');
    div.style.backgroundColor = rColor();
    div.textContent = pos.count+1;
    div.style.left = pos.x+'px';
    div.style.top = pos.y+'px';
    container.appendChild(div);
}

function rColor(){
    return '#'+Math.random().toString(16).substr(-6);
}

function isCollide(a,b){
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    // console.log(aRect);//paddle
    // console.log(bRect);//ball
    // let temp1 = !((aRect.right < bRect.left) || (aRect.left > bRect.right));
    // let temp2 = !((aRect.bottom < bRect.top) || (aRect.top > bRect.bottom));
    // console.log(temp1);
    // console.log(temp2);
    return !(((aRect.right < bRect.left) || 
    (aRect.left > bRect.right)) ||
     ((aRect.bottom < bRect.top) || 
     (aRect.top > bRect.bottom)));
}
    


function scoreUpdater(){
    document.querySelector('.score').textContent = player.score;
    document.querySelector('.lives').textContent = player.lives;
}

function update(){
    let pCurrent = paddle.offsetLeft;
    //console.log(pCurrent);
    //moveBall();
    if(paddle.left && pCurrent > 0){
        pCurrent-=5;        
    }
    paddle.style.left = pCurrent+'px';
    
    if(paddle.right && pCurrent< conDim.width - paddle.offsetWidth){
        pCurrent+=5;        
    }
    // isCollide(paddle,ball);
    paddle.style.left = pCurrent+'px';
    if(!player.inPlay){
        waitingOnPaddle();
    }else{
        moveBall();
    }
    player.ani = window.requestAnimationFrame(update);
}

function waitingOnPaddle(){
    ball.style.top = (paddle.offsetTop - 22)+'px';
        ball.style.left = (paddle.offsetLeft + 50)+'px';
}
function fallOff(){
    player.lives--;
    if(player.lives<0){
        endGame();
        player.lives = 0;
    }
    scoreUpdater();
    stopper();
}

function endGame(){
            gameOver.style.display = "block";
            gameOver.innerHTML = "Game Over <br> Your score:" + player.score;
            player.gameover = true;
            ball.style.display = "none";
            let tempBricks = document.querySelectorAll('.brick');
            for (let tBrick of tempBricks) {
                tBrick.parentNode.removeChild(tBrick);
            } 
}
function stopper(){
    player.inPlay = false;
    player.ballDir[0,5];
    waitingOnPaddle();
    window.cancelAnimationFrame(player.ani);
}

function moveBall(){
    let posBall = {
        x:ball.offsetLeft,
        y:ball.offsetTop
    }
    if(posBall.y >(conDim.height-20) || posBall.y <0){
        if(posBall.y >(conDim.height -20)){
            fallOff();
        }else{
            player.ballDir[1] *=-1;
        }
    }
    if(posBall.x >(conDim.width-20) || posBall.x <0){
        
            player.ballDir[0] *=-1;
        
        
    }
    if(isCollide(paddle,ball)){
        let temp = ((posBall.x - paddle.offsetLeft)-(paddle.offsetWidth/2))/10;
        console.log('hit');
        player.ballDir[0] = temp;
        player.ballDir[1]*=-1;
    };
    let bricks = document.querySelectorAll('.brick');
    
    if(bricks.length == 0){
        stopper();
        setupBricks(player.num);
    }

    for(let tBrick of bricks){
        if(isCollide(tBrick,ball)){
            player.ballDir[1] *=-1;
            tBrick.parentNode.removeChild(tBrick);
            player.score++;
            scoreUpdater();
        }
    }

    posBall.y+=player.ballDir[1];
    posBall.x+=player.ballDir[0];

    ball.style.top = posBall.y+'px';
    ball.style.left = posBall.x+'px';

}

// var start = null;

// function step(timestamp){
//     if(!start) start = timestamp;
//     var progress = timestamp - start;
//     container.style.transform = 'translateX('+Math.min(progress/10,200)+'px)';
    
//     if(progress < 2000){
//         console.log(progress);
//         window.requestAnimationFrame(step);
//     }
// }
// window.requestAnimationFrame(step)