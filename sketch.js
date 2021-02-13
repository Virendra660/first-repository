var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;


function preload(){
  trex_running =   loadAnimation("trex_1.png","trex_3.png","trex_2.png");
  trex_collided = loadAnimation("trex_collided-1.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud-1.png");
  
  obstacle1 = loadImage("obstacle1-1.png");
  obstacle2 = loadImage("obstacle2-1.png");
  obstacle3 = loadImage("obstacle3-1.png");
  obstacle4 = loadImage("obstacle4-1.png");
  
  
  gameOverImg = loadImage("gameOver-1.png");
  restartImg = loadImage("restart-1.png");
  bgimage= loadImage("backgroundImg.png")
  
  jumpSound = loadSound("checkPoint-1.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  bg=createSprite(0,0,600,200)
  bg.addImage("n",bgimage)
  bg.scale=5;  
  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.08;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.08;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  trex.setCollider("rectangle",0,0,80,trex.height)
  trex.debug=false;
  
  score = 0;
}

function draw()
{ 
 // background("pink");

  if (gameState===PLAY)
  {
    score = score + Math.round(getFrameRate()/60);
    
    ground.velocityX = -(6 + 3*score/100);
    //change the trex animation
    trex.changeAnimation("running", trex_running);
    console.log(trex.y)
    
    if(keyDown("space") && trex.y >= 145)
    {
      trex.velocityY = -12;
       jumpSound.play();
    }
    //gravity to get the trex back
    trex.velocityY = trex.velocityY + 0.8
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    //makes ground infinite
    if (ground.x < 0)
    {
      ground.x = ground.width/2;
    }
    //stopping the trexx from falling down
    trex.collide(invisibleGround);
    //caalling the functions of createing clouds and cactus
    spawnClouds();
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex))
    {
        gameState = END;
       dieSound.play();
    }
    
  }
  else if (gameState === END)
  {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are    never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) 
    {
      reset();
    }
  } 
  
  drawSprites();
  text("Score: "+ score, 500,50);
  textSize(16);
  text("Virendra's game",250,50);
}

//user defined functions....
//function to create clouds
function spawnClouds() 
{
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) 
  {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(40,80));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}


//function for reset
function reset()
{
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}

//function to create cactus
function spawnObstacles()
{
  if(frameCount % 60 === 0) 
  {
    var obstacle = createSprite(600,160,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles and to apply images
    var rand = Math.round(random(1,4));
    switch(rand)
    {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale=0.3
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale=0.3
              break;
      case 3: obstacle.addImage(obstacle3);
              obstacle.scale=0.1
              break;
      case 4: obstacle.addImage(obstacle4);
               obstacle.scale=0.1
              break;
      
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
   // obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

