var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 10800,
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
    }
};
var player;
var stars;
var platforms;
var fon;
var bomb;
var game = new Phaser.Game(config);

function preload() {
    this.load.image("fon", "assets/fon.webp");
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image("Stone","assets/Stone.png");
    this.load.image("Crate","assets/Crate.png");
    this.load.image("Tree_3","assets/Tree_3.png");
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}
function create() {
    //створили фон
    this.add.tileSprite(0, 0, worldWidth, 1080, "fon").setOrigin(0, 0);
    //додали платформи
    platforms = this.physics.add.staticGroup();
    //земля по ширині всього екрану
    for (var x = 0; x < worldWidth; x = x + 450) {
        console.log(x)
        platforms.create(x, 1080 - 120, "ground").setOrigin(0, 0).refreshBody();
    }
    //додали гравця
    player = this.physics.add.sprite(1080, 900, "dude");
    player.setBouce(0.2);
    player.setCollideWorldBounds(false);
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    this.physics.add.collider(player, platforms);
    //налаштуємо камеру
    this.cameras.main.ssetBounds(0, 0, worldWidth, 1080);
    this.physics.world.setBounds(0, 0, worldWidth, 1080);


}