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

       // this.load.image('sky', 'assets/background-day.jpg');
        this.load.spritesheet('player', 'assets/flatboy_ss_full01.png'
        ,{ frameWidth: 616, frameHeight: 525 });
        this.load.image('ground', 'assets/platform.jpg');
    }

     create ()
    {
      //  gameState.background =this.add.image(490, 300, 'sky').setScale(0.19);

        gameState.player = this.physics.add.sprite(50,400, 'player')
        .setScale(0.15);

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

        const platforms = this.physics.add.staticGroup();
        platforms.create(750, 819, 'ground').setScale(0.3).refreshBody();
        platforms.create(2251, 819, 'ground').setScale(0.3).refreshBody();

        gameState.player.setCollideWorldBounds(true);
        this.physics.add.collider(gameState.player, platforms);

		gameState.cursors = this.input.keyboard.createCursorKeys();
        
        //camera setting
        this.cameras.main.setBounds(0, 0, gameState.width, gameState.height);
        this.physics.world.setBounds(0, 0, gameState.width, gameState.height);
        this.cameras.main.startFollow(gameState.player,true,0.5,0.5);
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