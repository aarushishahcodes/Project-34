// declaring global constants and variables
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var fruit, rope, l_rope, r_rope;
var fruit_con, l_con, r_con;

var bg_img;
var fruit_img;
var rabbit_img;

var rabbit;

var button, l_button, r_button;
var balloon, v_balloon, blowing;
var mute_button;

var bg_sound, eat_sound, cry_sound, blower_sound, rope_sound;
var blink, eat, sad;

// star scores
var star0, star1, star2, star_score;
var score = 0;

// star sprite
var star, s_star, star_image;

var edges;
var amazing, amazing_img;

function preload()
{
  bg_img = loadImage("Candyland Background.jpeg");
  fruit_img = loadImage("pinkcandytwo.png");
  rabbit_img = loadImage("Rabbit-01.png");
  amazing_img = loadImage("amazing.png");

  star_image = loadImage("star.png");

  star0 = loadAnimation("empty.png");
  star1 = loadAnimation("one_star.png");
  star2 = loadAnimation("stars.png");
  
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");

  bg_sound = loadSound("sound1.mp3");
  eat_sound = loadSound("eating_sound.mp3");
  cry_sound = loadSound("sad.wav");
  blower_sound = loadSound("Cutting Through Foliage.mp3");
  rope_sound = loadSound("rope_cut.mp3");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;

  eat.looping = false;
  sad.looping = false;
}

function setup() 
{
  // making it eligible for mobile users
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if(isMobile){
    createCanvas(displayWidth, displayHeight);
  }
  else{
    createCanvas(windowWidth, windowHeight);
  }

  frameRate(80);
  edges = createEdgeSprites();

  bg_sound.play();
  bg_sound.setVolume(0.1);

  blink.frameDelay = 9;
  eat.frameDelay = 9;
  sad.frameDelay = 9;

  rabbit = createSprite(width/2+200,height-70,20,20);
  rabbit.scale = 0.18;
  
  rabbit.addAnimation("blinking", blink);
  rabbit.addAnimation("eating", eat);
  rabbit.addAnimation("crying", sad);
  
  rabbit.changeAnimation("blinking");

  rabbit.velocityX = 3;

  amazing = createSprite(width/2,height/2,100,100);
  amazing.addImage(amazing_img);
  amazing.scale = 1;
  amazing.visible = false;

  star = createSprite(width/2-400,height/2-100,20,20);
  star.addImage(star_image);
  star.scale = 0.02;

  s_star = createSprite(width/2-150,height-620,20,20);
  s_star.addImage(star_image);
  s_star.scale = 0.02;

  star_score = createSprite(55,30,20,20);
  star_score.addAnimation("blank",star0);
  star_score.addAnimation("one",star1);
  star_score.addAnimation("two",star2);
  star_score.changeAnimation("blank");
  star_score.scale = 0.15;

  button = createImg("cut_button.png");
  button.size(50,50);
  button.position(width/2-22,30);
  button.mouseClicked((drop));

  l_button = createImg("cut_button.png");
  l_button.size(50,50);
  l_button.position(width/3-100,60);
  l_button.mouseClicked((l_drop));

  r_button = createImg("cut_button.png");
  r_button.size(50,50);
  r_button.position(width-450,190);
  r_button.mouseClicked((r_drop));

  balloon = createImg("balloon.png");
  balloon.size(120,100);
  balloon.position(width/2-600,250);
  balloon.mouseClicked(blow);

  v_balloon = createImg("baloon2.png");
  v_balloon.size(100,120);
  v_balloon.position(width/2-100,400);
  v_balloon.mouseClicked(v_blow);

  blowing = createImg("balloons.png");
  blowing.size(100,100);
  blowing.position(width/2+500,250);
  blowing.mouseClicked(blowing_sound);


  mute_button = createImg("mute.png");
  mute_button.size(50,50);
  mute_button.position(width-100,30);
  mute_button.mouseClicked(mute);


  engine = Engine.create();
  world = engine.world;

  ground = new Ground(width/2,height-20,width,20);

  rope = new Rope(7,{x:width/2,y:30});
  l_rope = new Rope(8,{x:width/3-100,y:60});
  r_rope = new Rope(8,{x:width-450,y:190});

  fruit = Bodies.circle(width/2,350,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  l_con = new Link(l_rope,fruit);
  r_con = new Link(r_rope,fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  imageMode(CENTER);
  
}

function draw() 
{
  background(51);
  image(bg_img,width/2,height/2,width,height);
  Engine.update(engine);

  if(fruit != null){
    image(fruit_img,fruit.position.x,fruit.position.y,70,70);
  }

  rope.show();
  l_rope.show();
  r_rope.show();
  
  ground.show();

  if(collide(fruit, rabbit, 80) === true){
    rabbit.changeAnimation("eating");
    eat_sound.play();
    eat_sound.setVolume(0.2);
    World.remove(world, fruit);
    fruit = null;
    amazing.visible = true;
    rabbit.velocityX = 0;
    v_balloon.remove();
    balloon.remove();
    button.remove();
    l_button.remove();
    r_button.remove();
    blowing.remove();
    
  }

  if(collide(fruit, star, 20) === true){
    star.remove();
    score += 1;
  }

  if(collide(fruit, s_star, 20) === true){
    s_star.remove();
    score += 1;
  }

  if(fruit != null && fruit.position.y > height-50){
    rabbit.changeAnimation("crying");
    cry_sound.play();
    cry_sound.setVolume(0.2);
  }

  if(score === 1){
    star_score.changeAnimation("one");
  }
  else if(score === 2){
    star_score.changeAnimation("two");
  }

  // setInterval(blowing_sound, 3000);

  if(frameCount%(120) === 0){
    blowing_sound();
  }

  // blowing_sound();
  rabbit.bounceOff(edges);
  drawSprites();
  
}

function drop(){
  rope.break();
  fruit_con.detach();
  fruit_con = null;
  rope_sound.play();
  rope_sound.setVolume(0.2);
}

function l_drop(){
  l_rope.break();
  l_con.detach();
  l_con = null;
  rope_sound.play();
  rope_sound.setVolume(0.2);
}

function r_drop(){
  r_rope.break();
  r_con.detach();
  r_con = null;
  rope_sound.play();
  rope_sound.setVolume(0.2);
}

function collide(body, sprite, distance){
  // body = fruit, sprite = rabbit or ground
  // we are checking if fruit exists
  if(body != null){
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if(d < distance){
      // World.remove(world, fruit);
      // fruit = null;
      // true means that they have collided, and false means they haven't
      return true;
    }
    else{
      return false;
    }
  }
}

function blow(){
  blower_sound.play();
  Body.applyForce(fruit, {x: 0, y: 0}, {x: 0.08, y: 0});
}

function v_blow(){
  blower_sound.play();
  Body.applyForce(fruit, {x: 0, y: 0}, {x: 0, y: -0.08});
}

function blowing_sound(){
  // blower_sound.play();
  if(fruit != null){
    Body.applyForce(fruit, {x: 0, y: 0}, {x: -0.05, y: 0});
  }}

function mute(){
  if(bg_sound.isPlaying()){
    bg_sound.stop();
  }
  else{
    bg_sound_play();
  }
}