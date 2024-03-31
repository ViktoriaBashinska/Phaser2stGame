var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    playerSpeed: 1500,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 250 },
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
var objects;
var platforms;
var cursors;
var playerSpeed = 1500;
var score = 0;
var life = 3;
var gameOver = false;
var scoreText;
var lifeText;
var restartButton;
var worldWidth = config.width * 5;

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
        //console.log(x)
        platforms
            .create(x, 1080 - 128, 'ground')
            .setOrigin(0, 0)
            .refreshBody();
    }
    objects = this.physics.add.staticGroup();
    //додали об'єкти
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
        var y = Phaser.Math.FloatBetween(500, 1080); // Змінили діапазон висоти платформ
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
    lifeText = this.add.text(1500, 100, showLife(), { fontSize: '32px', fill: '#FFF' })
    lifeText.setOrigin(0, 0)
        .setDepth(10)
        .setScrollFactor(0);



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
    //додали кнопку перезапуску
    restartButton = this.add.text(100, 70, 'Restart', { fontSize: '32px', fill: '#FFF' })
        .setInteractive()
        .setDepth(10)
        .setScrollFactor(0)
        .on('pointerdown', restartGame); // Додаємо обробник подій для натискання на кнопку
}

function restartGame() {
    // Перезапускаємо гру
    life = 3;
    score = 0;
    lifeText.setText(showLife());
    scoreText.setText('Score: 0');
    gameOver = false;
    isHitByBomb = false;

    // очищення групи об'єктів
    stars.clear(true, true);
    bombs.clear(true, true);
    createStars();
    createBombs();

    // Повернули гравця на його початкове місце
    player.setPosition(1500, 900);
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

    // Якщо гра закінчилася, показати кнопку перезапуску
    if (gameOver) {
        restartButton.setVisible(true);
    } else {
        restartButton.setVisible(false);
    }
}

//Додали збираня зірок
function collectStar(player, star) {
    star.disableBody(true, true);
    score += 5;
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
var isHitByBomb = false;
function hitBomb(player, bomb) {
    if (isHitByBomb) {
        return;
    }
    isHitByBomb = true;

    life = life - 1;
    lifeText.setText(showLife());
    var direction = (bomb.x < player.x) ? 1 : -1;
    bomb.setVelocity(300 * direction);

    player.setTint(0xff0000);
    this.time.addEvent({
        delay: 1000,
        callback: function () {
            player.clearTint();
            isHitByBomb = false;

            if (life === 0) {
                gameOver = true;
                //показуємо кнопку перезапуску
                restartButton.setVisible(true);
                this.physics.pause();
                player.anims.play("turn");
            }
        },
        callbackScope: this,
        loop: false
    });
}


//смуга життя
function showLife() {
    var lifeLine = ""

    for (var i = 0; i < life; i++) {
        lifeLine += "❤"
    }
    return lifeLine
}