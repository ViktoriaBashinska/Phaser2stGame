var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
        },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var player;
var bomb;
var crates;
var platforms;
var stars;
var stones;
var trees;
var score = 0;
var ScoreText;
var gameOver = false;
var worldWidth = 5000;
var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('fon', 'assets/fon.webp');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude','assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    this.add.tileSprite(0, 0, worldWidth, 1080, "fon").setOrigin(0, 0);
}

function update ()
{
}