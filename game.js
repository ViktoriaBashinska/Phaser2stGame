var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: game,
    playerSpeed: 1000,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);
var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var lifes = 3;
var gameOver = false;
var scoreText;
var lifeText;

var worldWidth = config.width * 2;

function preload() {
    //Додали асети
    this.load.image('fon', 'assets/fon.webp');
    this.load.image('ground', 'assets/2.png');
    this.load.image('crate', 'assets/Crate.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('tree', 'assets/Tree_3.png');
    this.load.image('stone', 'assets/Stone.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('SkyGroundStart', 'assets/13.png');
    this.load.image('SkyGround', 'assets/14.png');
    this.load.image('SkyGroundEnd', 'assets/15.png');
    this.load.spritesheet('dude', 'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create() {
    //Додали платформу та небо
    this.add.tileSprite(0, 0, worldWidth, 1080, "fon")
        .setOrigin(0, 0)
        .setScale(1)
        .setDepth(0);

    platforms = this.physics.add.staticGroup();
    //Створення землі на всю ширину
    for (var x = 0; x < worldWidth; x = x + 128) {
        console.log(x)
        platforms
            .create(x, 1080 - 128, 'ground')
            .setOrigin(0, 0)
            .refreshBody();
    }
    objects = this.physics.add.staticGroup();

    for (var x = 0; x <= worldWidth; x = x + Phaser.Math.Between(200, 800)) {
        objects
            .create(x, 987, 'crate')
            .setScale(Phaser.Math.FloatBetween(0.5, 1,))
            .setDepth(Phaser.Math.Between(1, 3))
            .setOrigin(0, 1)
            .refreshBody();
        objects
            .create(x, 987, 'stone')
            .setScale(Phaser.Math.FloatBetween(0.5, 1,))
            .setDepth(Phaser.Math.Between(1, 3))
            .setOrigin(0, 1)
            .refreshBody();
        objects
            .create(x, 989, 'tree')
            .setScale(Phaser.Math.FloatBetween(0.5, 1,))
            .setDepth(Phaser.Math.Between(1, 3))
            .setOrigin(0, 1)
            .refreshBody();
    }
    //Додали гравця

    player = this.physics.add.sprite(1500, 900, 'dude');
    player
        .setBounce(0.2)
        .setCollideWorldBounds(false)
        .setDepth(Phaser.Math.Between(2));
    //Налаштування камери
    this.cameras.main.setBounds(0, 0, worldWidth, 1080);
    this.physics.world.setBounds(0, 0, worldWidth, 1080);
    //Додали слідкування камери за спрайтом
    this.cameras.main.startFollow(player);

    var x = 0;
    while (x < worldWidth) {
        var y = Phaser.Math.FloatBetween(500, 1080); // Змінили діапазон висоти платфор
        x += Phaser.Math.FloatBetween(200, 700); // Збільшили відстань між платформами
    }

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
    //Додали курсор
    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: 'star',
        repeat: 111,
        setXY: { x: 12, y: 0, stepX: 90 }
    });
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    bombs = this.physics.add.group();
    //додаємо рахунок
    scoreText = this.add.text(100, 100, 'Score: 0', { fontSize: '32px', fill: '#FFF' })
    scoreText.setOrigin(0, 0)
        .setDepth(10)
        .setScrollFactor(0);
    //додали життя
    lifesText = this.add.text(1500, 100, showLife(), { fontSize: '32px', fill: '#FFF' })
    lifesText.setOrigin(0, 0)
        .setDepth(10)
        .setScrollFactor(0);
    //кнопка перезапуску
    var resetButton = this.add.text(400, 450, "reset", { fontSize: "40px", fill: "#ccc" })
        .setInteractive()
        .setScrollFactor(0);

    resetButton.on("pointerdown", function () {
        console.log ("restart")
        refreshBody()
    });
    //Додали зіткнення зірок з платформою
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    //додали плаформи випадковим чином
    for (var x = 0; x < worldWidth; x = x + Phaser.Math.Between(400, 500)) {
        var y = Phaser.Math.Between(100, 700)

        platforms.create(x, y, 'SkyGroundStart');
        platforms.create(x + 128, y, 'SkyGround');
        platforms.create(x + 128 * 2, y, "SkyGroundEnd");
    }
}

function update() {
    if (gameOver) {
        return;
    }
    //Додали керування персонажем
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
}
//Додали збираня зірок
function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);

    var x = Phaser.Math.Between(0, config.width);
    var y = Phaser.Math.Between(0, config.height);
    var bomb = bombs.create(x, y, 'bomb');
    bomb.setScale(1);
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
    }
}
//колізія гравця та бомб
function hitBomb(player, bomb) {
    bomb.disableBody (true, true);

    player.setTint(0xff0000);
    life -= 1
    lifeText.setText (showLife())

    console.log ("bomb")
    player.aims.play("turn");

    if (life == 0) gameOver = true;
}
//перезапуск гри
function refreshBody (){
    console.log ("game over")
}

//смуга життя
function showLife(){
    var lifeLine = ""

    for (var i = 0; i < life; i ++){
        lifeLine += "❤"
    }
    return lifeLine
}