const gameState = {
 playerSpeed : 160,
 width : 3000,
 height : 900
}

class GameScene extends Phaser.Scene{
    constructor(){
		super({ key: 'GameScene' });
	}

     preload ()
    {

        this.load.image('bgImg1', 'assets/mountain-background.jpg');
        this.load.spritesheet('player', 'assets/flatboy_ss_full01.png'
        ,{ frameWidth: 616, frameHeight: 525 });
        this.load.image('ground', 'assets/platform.jpg');
        this.load.image('bgImg2','./assets/tree-background01.png');
    }

     create ()
    {
        
        gameState.background =this.add.image(960, 300, 'bgImg1').setScale(1);
        gameState.backgroundMirror =this.add.image(2880, 300, 'bgImg1').setScale(1);
        gameState.backgroundMirror.flipX = true;

        gameState.backgroundTree = this.add.image(960, 450, 'bgImg2').setScale(1);
        gameState.backgroundTreeMirror = this.add.image(2880, 450, 'bgImg2').setScale(1);
      //  gameState.backgroundTreeMirror.flipX= true;


        gameState.player = this.physics.add.sprite(50,400, 'player')
        .setScale(0.15);
        
        const platforms = this.physics.add.staticGroup();
        platforms.create(750, 819, 'ground').setScale(0.3).refreshBody();
        platforms.create(2251, 819, 'ground').setScale(0.3).refreshBody();


        //animation from spriteSheet

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

       

        gameState.player.setCollideWorldBounds(true);
        this.physics.add.collider(gameState.player, platforms);

		gameState.cursors = this.input.keyboard.createCursorKeys();
        
        //camera setting
        this.cameras.main.setBounds(0, 0, gameState.width, gameState.height);
        this.physics.world.setBounds(0, 0, gameState.width, gameState.height);
        this.cameras.main.startFollow(gameState.player,true,0.5,0.5);
    }

   /*  createParallaxBackgrounds(){
        gameState.bg1 = this.add.image(0, 0, 'bgImg1');
        gameState.bg2 = this.add.image(0, 0, 'bgImg2');

        gameState.bg1.setOrigin(0, 0);
        gameState.bg2.setOrigin(0, 0);

        const game_width = parseFloat(gameState.bg1.getBounds().width)
        gameState.width = game_width;
        const window_width = config.width;

        const bg1_width = gameState.bg1.getBounds().width;
        const bg2_width = gameState.bg2.getBounds().width;

        //set scroll factor
        gameState.bg1.setScrollFactor((bg1_width - window_width) / (game_width - window_width)); 
        gameState.bg2.setScrollFactor((bg2_width - window_width) / (game_width - window_width));
    } */

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

         } else if( (Phaser.Input.Keyboard.JustDown(gameState.cursors.space) || Phaser.Input.Keyboard.JustDown(gameState.cursors.up)) &&
        gameState.player.body.touching.down){
            gameState.player.setVelocityY(-200);
           
        }
            else if(gameState.cursors.up.isDown || gameState.cursors.space.isDown) {
                gameState.player.anims.play('jump',true);
            }
        else{
            gameState.player.setVelocityX(0);
            gameState.player.anims.play('idle',true);
        }

       
    }


}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            enableBody : true,
        }
    },
    backgroundColor: "F1FAEF",
    scene: [GameScene]
};


var game = new Phaser.Game(config);