const gameState = {

}

class GameScene extends Phaser.Scene{
    constructor(){
		super({ key: 'GameScene' });
	}

     preload ()
    {

        this.load.image('sky', 'assets/background-day.jpg');
        this.load.image('player', 'assets/kappa.png');
        this.load.image('ground', 'assets/platform.jpg');
    }

     create ()
    {
        gameState.background =this.add.image(490, 300, 'sky').setScale(0.13);

        gameState.player = this.physics.add.sprite(50,400, 'player')
        .setScale(0.1);

        const platforms = this.physics.add.staticGroup();

        platforms.create(490, 547, 'ground').setScale(0.3).refreshBody();
        gameState.player.setCollideWorldBounds(true);
        this.physics.add.collider(gameState.player, platforms);

		gameState.cursors = this.input.keyboard.createCursorKeys();
        
        
    }

     update()
    {
        if(gameState.cursors.left.isDown){
            gameState.player.setVelocityX(-160);
        } else if( gameState.cursors.right.isDown){
            gameState.player.setVelocityX(160);
        } else if( gameState.cursors.up.isDown ){
            gameState.player.setVelocityY(-100);
            //add conditional only jump if player collide with something
        }
        else{
            gameState.player.setVelocityX(0);
        }
    }


}

var config = {
    type: Phaser.AUTO,
    width: 980,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            enableBody : true,
        }
    },
    scene: [GameScene]
};


var game = new Phaser.Game(config);