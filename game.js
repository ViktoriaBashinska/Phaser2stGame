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
        objects.create(x, 987, 'crate').setScale(Phaser.Math.FloatBetween(0.5, 1,)).setDepth(Phaser.Math.Between(0, 2)).setOrigin(0, 1).refreshBody();
        objects.create(x, 987, 'stone').setScale(Phaser.Math.FloatBetween(0.5, 1,)).setDepth(Phaser.Math.Between(0, 2)).setOrigin(0, 1).refreshBody();
        objects.create(x, 989, 'tree').setScale(Phaser.Math.FloatBetween(0.5, 1,)).setDepth(Phaser.Math.Between(0, 2)).setOrigin(0, 1).refreshBody();
    }


    //Додали гравця
    player = this.physics.add.sprite(1500, 900, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(false);
    //Налаштування камери
    this.cameras.main.setBounds(0, 0, worldWidth, 1080);
    this.physics.world.setBounds(0, 0, worldWidth, 1080);
    //Додали слідкування камери за спрайтом
    this.cameras.main.startFollow(player);

    var x = 0;
    while (x < worldWidth) {
        // Змінили діапазон висоти платформ
        var y = Phaser.Math.FloatBetween(540, 1080); 
        // Зменшуємо масштаб платформ
        platforms.create(x, y, 'ground').setScale(1).refreshBody(); 
        // Збільшили відстань між платформами
        x += Phaser.Math.FloatBetween(200, 700); 
    }
    //анімація (рух) гравця
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

    for (var x = 0; x < worldWidth; x = x + Phaser.Math.FloatBetween(400, 500)) {
        var y = Phaser.Math.FloatBetween(100, 1000)
        console.log(Fx, y)
        platforms.create(x, y, "ground");
    }

}

function update() {
    if (gameOver) {
        return;
    }
    //керування гравцем
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-480);
    }
    //збір зірок
    function collectStar(player, star) {
        star.disableBody(true, true);
        score += 10;
        scoreText.setText('Score: ' + score);
    }
}