var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: game,
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
var bombs;
var crates;
var platforms;
var stars;
var stones;
var trees;
var score = 0;
var ScoreText;
var gameOver = false;
var worldWidth = 9600;
var game = new Phaser.Game(config);

function preload() {
    this.load.image('fon', 'assets/fon.webp');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('crate', 'assets/Crate.png');
    this.load.image('stone', 'assets/Stone.png');
    this.load.image('tree', 'assets/Tree_3.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    //додаємо фон плиткою
    this.add.tileSprite(0, 0, worldWidth, 1080, "fon").setOrigin(0, 0);
    //додаємо платформи
    platforms = this.physics.add.staticGroup();
    //додаємо землю на всю ширину екрану
    for (var x = 0; x < worldWidth; x = x + 384) {
        console.log(x)
        platforms.create(x, 1080 - 93, "ground").setOrigin(0, 0).refreshBody();
    }

    objects = this.physics.add.staticGroup();

    for (var x = 0; x <= worldWidth; x = x + Phaser.Math.Between(200, 800)) {
        objects.create(x, 987, 'crate').setScale(Phaser.Math.FloatBetween(0.5, 2,)).setDepth(Phaser.Math.Between(0, 2)).setOrigin(0, 1).refreshBody();
        objects.create(x, 987, 'stone').setScale(Phaser.Math.FloatBetween(0.5, 2,)).setDepth(Phaser.Math.Between(0, 2)).setOrigin(0, 1).refreshBody();
        objects.create(x, 989, 'tree').setScale(Phaser.Math.FloatBetween(0.5, 2,)).setDepth(Phaser.Math.Between(0, 2)).setOrigin(0, 1).refreshBody();
    }


    //Додали гравця
    player = this.physics.add.sprite(1500, 900, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(false);



    for (var x = 0; x < worldWidth; x = x + Phaser.Math.FloatBetween(400, 500)) {
        var y = Phaser.Math.FloatBetween(100, 1000)
        console.log(Fx, y)
        platforms.create(x, y, "ground");
    }

}

function update() {
}