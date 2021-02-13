var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
//creates vars for the endgame screen
var score;
var gameover,gameoverImage, restart, restartImage
var checkpoint, die, jump
var highscore

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  gameoverImage = loadImage("gameOver.png")
  restartImage = loadImage("restart.png")
  checkpoint = loadSound("checkPoint.mp3")
  die = loadSound("die.mp3")
  jump = loadSound("jump.mp3")
  
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud1.png");
  //loads obstacles
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
}

function setup() {
  createCanvas(600, 200);
  //keeps a small collision radius
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,40);
  trex.debug = true
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  highscore = 0
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  score = 0;
  //makes the endgame screen invisble 
  gameover = createSprite(300,100);
  gameover.addImage(gameoverImage)
  restart = createSprite(300,140);
  restart.addImage(restartImage)
  gameover.scale = 0.5 
  restart.scale = 0.5 
  gameover.visible = false
  restart.visible = false
}

function draw() {
  background(180);
  //displaying score
  fill("black")
  text("Score:"+ score, 500,50);
  text("highscore: "+ highscore, 410,50 )
  
  if(score > highscore){
    
    highscore = score
    
  }
  // play gamestate
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -4;
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (score > 0 && score% 100 === 0){
      checkpoint.play();

    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    
    
      
    
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -13;
      jump.play();
      
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
      gameover.visible = false
     restart.visible = false
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      die.play();
      //trex.velocityY = -13;
      //jump.play();
      
    }
  }
   else if (gameState === END) {
      ground.velocityX = 0;
     //makes gameover/reset visible
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     trex.changeAnimation("collided",trex_collided)
     trex.velocityY = 0
     gameover.visible = true
     restart.visible = true
   }
  
 if (mousePressedOver(restart)){
   reset()
 } 
  
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}


function reset(){

trex.changeAnimation("running", trex_running);
gameState = PLAY
obstaclesGroup.destroyEach();
cloudsGroup.destroyEach();
score = 0  
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + 3 * score / 100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = -1;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = -1;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

