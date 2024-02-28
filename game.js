var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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

function preload() {
    this.load.image("fon","assets/fon.webp");
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet ('dude', 'assets/dude.png',  { frameWidth: 32, frameHeight: 48 });
}
function create() {
    //створили фон
this.add.tileSprite(0,0, worldWidth,1080, "fon").setOrigin(0,0);
//додали платформи
platforms = this.physics.add.staticGroup();
//земля по ширині всього екрану
for (var x = 0; x < worldWidth; x = x + 450 ){
    console.log (x)
platforms.create (x, 1080-120, "ground").setOrigin(0,0).refreshBody();
}
//додали гравця
player = this.physics.add.sprite (1080, 900, "dude");
player.setBouce(0.2);
player.setCollideWorldBounds(false);
//налаштуємо камеру
this.cameras.main.ssetBounds(0, 0, worldWidth, 1080);
this.physics.world.setBounds(0, 0, worldWidth, 1080);


}