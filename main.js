'use strict'
const game = new Phaser.Game(1192,670, Phaser.AUTO, 'game canvas', { preload, create, update });
var platforms;
var player;
var cursors;
var stars;
var bombs;
var score = 0;
var scoreText;
var starsCount;
var Text1;
var winning;
var losing;
function preload() {

    game.load.image('sky', 'backgroundat.jpg');
    game.load.image('ground', 'image.png');
    game.load.image('star', 'star.png');
    game.load.image('bomb', 'bomb.png');
    game.load.spritesheet('dude', 'finn.png', 256/8, 289/9);
    game.load.image('win', 'win.jpg');
    game.load.image('lose', 'lose.jpg');
}
function create() {

    game.add.sprite(0, 0, 'star');

    game.add.sprite(0, 0, 'bomb');

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'sky');

    platforms = game.add.group();

    platforms.enableBody = true;

    var ground = platforms.create(0, game.world.height - 64, 'ground');

    ground.scale.setTo(2, 0.8);

    ground.body.immovable = true;

    var ledge = platforms.create(350, 450, 'ground');

    ledge.body.immovable = true;

    var ledge1 = platforms.create(0, 300, 'ground');

    ledge1.body.immovable = true;

    player = game.add.sprite(32, game.world.height - 150, 'dude');

    game.physics.arcade.enable(player);
 
    ledge.scale.setTo(0.5, 0.5);
    ledge1.scale.setTo(0.5, 0.5)
    player.body.bounce.y = 0.4;
    player.body.gravity.y = 200;
    player.body.collideWorldBounds = true;
    player.width=50;
    player.height=60;
    

    player.animations.add('right', [25, 26, 27, 28], 5, true);
    player.animations.add('left', [57, 58, 59, 60], 5, true);

    cursors = game.input.keyboard.createCursorKeys();

    stars = game.add.group();

    stars.enableBody = true;

    starsCount = 0;

    for (var i = 0; i < 13; i++)
    {
        var star = stars.create(i * game.rnd.realInRange(80,95), i*game.rnd.realInRange(0,0), 'star');

        star.body.gravity.y = 1000;

        starsCount+=1;
    }

    bombs = game.add.group();

    bombs.enableBody = true;

    for (var i = 0; i < 6; i++)
    {
        var bomb = bombs.create(i * game.rnd.realInRange(160,200), i*game.rnd.realInRange(90,20), 'bomb');
        
        bomb.width=50;
        bomb.height=22;
        
        bomb.body.gravity.y = 1000;

    }
    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#177B42' });
}
function update(){

    var hitPlatform = game.physics.arcade.collide(player, platforms);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        player.animations.stop();

        player.frame = 0;
    }

    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -350;
    }
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.collide(bombs, platforms);
    game.physics.arcade.overlap(player, bombs, collectBomb, null, this);
}
function collectStar (player, star) {

    star.kill();
    starsCount-=1;
    score += 10;
    scoreText.text = 'Score: ' + score;
    if(starsCount == 0 && score > 20)
    {
        winning = game.add.sprite(0, 0, 'win');
        winning.width = 1200;
        winning.height=700;
        setTimeout(() => {
            window.location.reload(true);
        }, 1000);
    }
    else if (starsCount == 0 && score <= 20)
    {
        losing = game.add.sprite(0, 0, 'lose');
        losing.width = 1200;
        losing.height=700;
        setTimeout(() => {
            window.location.reload(true);
        }, 1000);
    }
}
function collectBomb (player, bomb) {

    bomb.kill();
    score -= 10;
    scoreText.text = 'Score: ' + score;
}