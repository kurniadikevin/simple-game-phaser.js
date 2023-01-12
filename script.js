const gameState = {
 playerSpeed : 200,
 jumpPower : 300,
 width : 3000,
 height : 900,
}

class GameScene extends Phaser.Scene{
    constructor(key){
		super( key );
        this.levelKey = key
        this.nextLevel = {
          'Level1': 'Level2',
          'Level2': 'Level3',
          'Level3': 'Level4',
          'Level4': 'Credits',
        }
	}

     preload ()
    {

        this.load.image('bgImg1', 'assets/mountain-background.jpg');
        this.load.spritesheet('player', 'assets/flatboySS-noPadding.png'
        ,{ frameWidth: 350, frameHeight: 500 });
       this.load.spritesheet('playerCrawl', 'assets/crawl-ss.png'
        ,{ frameWidth: 481, frameHeight: 282 });

        this.load.image('ground', 'assets/platform.jpg');
        this.load.image('bgImg2','./assets/tree-background01.png');
        this.load.image('stoneStep','./assets/stoneMedium.png');
        this.load.image('trampoline','./assets/trampoline-crop.png');
    }


     create ()
    {
        
        gameState.background =this.add.image(960, 300, 'bgImg1').setScale(1);
        gameState.backgroundMirror =this.add.image(2880, 300, 'bgImg1').setScale(1);
        gameState.backgroundMirror.flipX = true;

        gameState.backgroundTree = this.add.image(960, 450, 'bgImg2').setScale(1);
        gameState.backgroundTreeMirror = this.add.image(2880, 450, 'bgImg2').setScale(1);

        gameState.player = this.physics.add.sprite(50,600, 'player')
        .setScale(0.15);
        
        
        gameState.platforms = this.physics.add.staticGroup();
        gameState.platforms.create(750, 819, 'ground').setScale(0.3).refreshBody();
        gameState.platforms.create(2251, 819, 'ground').setScale(0.3).refreshBody();

        gameState.step = this.physics.add.staticGroup();
        gameState.trampoline = this.physics.add.staticGroup();
    
        // setup static object if there is one
        if(this.levelStepSetup){
          this.stepSetup();
        }
        
        if(this.levelTrampolineSetup){
          this.trampolineSetup();
        }

       
        //ANIMATION FOR SPRITESHEET
        //run
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 6 }),
            frameRate: 10,
            repeat: -1
          });

          //idle
          this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
          });

          //jump
          this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
          });
          
          //crawl
          this.anims.create({
            key : 'crawl',
            frames: this.anims.generateFrameNumbers('playerCrawl', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
          })

        gameState.player.setCollideWorldBounds(true);
        this.physics.add.collider(gameState.player, gameState.platforms);
        this.physics.add.collider(gameState.player, gameState.step);
        this.physics.add.collider(gameState.player,gameState.trampoline,function(){
          gameState.player.setVelocityY(-gameState.jumpPower*1.5);
        })
        
		    gameState.cursors = this.input.keyboard.createCursorKeys();  
        //camera setting
        this.cameras.main.setBounds(0, 0, gameState.width, gameState.height);
        this.physics.world.setBounds(0, 0, gameState.width, gameState.height);
        this.cameras.main.startFollow(gameState.player,true,0.5,0.5); 
    }


    // create static object in game
 createStep(xIndex, yIndex) {
          if (typeof yIndex === 'number' && typeof xIndex === 'number') {
            gameState.step.create((60 * xIndex),  720-(yIndex * 60), 'stoneStep').setScale(0.24).refreshBody();
          }
      }

 createTrampoline(xIndex, yIndex) {
   /*  if ( yIndex === 0){
      gameState.trampoline.create((60 * xIndex),  720-((yIndex-1) * 60)-45, 'trampoline').setScale(0.0625).refreshBody();
    } */
    if (typeof yIndex === 'number' && typeof xIndex === 'number') {
      gameState.trampoline.create((60 * xIndex),  720-(yIndex * 60)-45, 'trampoline').setScale(0.0625).refreshBody();
    }
    
}
 
  //setup static object    
  stepSetup(){
    for( let i= 0 ; i< (this.levelStepSetup).length; i++){
        this.createStep(this.levelStepSetup[i][0],this.levelStepSetup[i][1]);
    }
  }

  trampolineSetup(){
    for( let i= 0 ; i< (this.levelTrampolineSetup).length; i++){
      this.createTrampoline(this.levelTrampolineSetup[i][0],this.levelTrampolineSetup[i][1]);
  }
  }


  
     update()
    {
        if(gameState.cursors.left.isDown){
            gameState.player.setVelocityX(-gameState.playerSpeed);
            gameState.player.flipX= true;
            gameState.player.anims.play('run',true);

         } else if( gameState.cursors.right.isDown){
            gameState.player.setVelocityX(gameState.playerSpeed);
            gameState.player.flipX= false;
            gameState.player.anims.play('run',true);

         } else if(gameState.cursors.down.isDown){
            gameState.player.anims.play('crawl',true);// still error not collide and padding not reduced
            
            
         }
         
         else if( (Phaser.Input.Keyboard.JustDown(gameState.cursors.space) || Phaser.Input.Keyboard.JustDown(gameState.cursors.up)) &&
        gameState.player.body.touching.down){
            gameState.player.setVelocityY(-gameState.jumpPower);
           
        }
            else if(gameState.cursors.up.isDown || gameState.cursors.space.isDown) {
                gameState.player.anims.play('jump',true);
            }
           
        else{
            gameState.player.setVelocityX(0);
            gameState.player.anims.play('idle',true);
        }

         if (gameState.player.body.position.y === 0){
            this.scene.stop(this.levelKey);
            this.scene.start(this.nextLevel[this.levelKey]);
            
        }
       
       //text caption
       const caption= document.querySelector('.caption');
       caption.textContent=this.levelKey;

    }
}


 // levelStepSetup guide :
 // place step by grid 50 x 15
 // left to right and down to up coordinate
 // if y is zero it is on ground platform
 // format [x,y]


class Level1 extends GameScene {
    constructor() {
      super('Level1')
      
      this.levelStepSetup = [
        [5,0],[6,0],[7,1],[9,3],[10,4],[10.5,4],[11,4],[13,4], [15,5],
        [17,7],[19,4],[20,4],[22,2],[5,3],[18,9]
                    ];
      this.levelTrampolineSetup = [[9,3],[10,4],[10.5,4]];
    }
  }

  class Level2 extends GameScene {
    constructor() {
      super('Level2')
      this.levelStepSetup = [  [5,0],[6,1],[7,2],[8,3],[9,4]];
   this.levelTrampolineSetup =[  [4,-1],  [5,0],[6,1],[7,2],[8,3],[9,4] ];
    
   
    }
  }


let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    fps: {target: 60},
    physics: {
        default: 'arcade',
        arcade: {
            debug : true,
            gravity: { y: 300 },
            enableBody : true,
        }
    },
    backgroundColor: "F1FAEF",
    scene: [Level1,Level2]
};


var game = new Phaser.Game(config);