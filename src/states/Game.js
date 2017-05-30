/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.game.load.tilemap('level1', '/assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
  }

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.TILE_BIAS = 60;

    this.loadMap();
    this.loadPlayer();
    this.loadStars();
    this.loadPower();
    this.loadSounds();
    this.setParticles();
    this.loadEnemies();
    this.initScoreCounter();
    this.setLevelText(1);
    this.initLives();

    //Default player velocity
    this.rightVelocity = 200;
    this.leftVelocity = -200;

    //Controls
    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.immunityTime = 0;

    this.powerCollected = false;
  }

  update () {
    this.game.physics.arcade.collide(this.stars, this.platformsLayer);
    this.game.physics.arcade.collide(this.player, this.platformsLayer);
    this.game.physics.arcade.collide(this.enemies, this.platformsLayer);
    this.game.physics.arcade.collide(this.power, this.platformsLayer);

    this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
    this.game.physics.arcade.overlap(this.player, this.power, this.collectPower, null, this);

    if (this.immunityTime < (new Date()).getTime() && !this.powerCollected) {
      this.game.physics.arcade.overlap(this.player, this.enemies, this.enemyAttack, null, this);
    }

    this.player.body.velocity.x = 0;

    if (this.player.y > 225 && this.player.alive) {
      this.playerSplashDeath();
    }

    this.inputs();
    this.updateEnemyMovement();
    this.checkLevelPassed();
  }

  inputs () {
    if (this.blockInputs) { return; }

    //Directions
    if (this.cursors.left.isDown)  {
      this.directionPlayer(this.leftVelocity, 'left');

    } else if (this.cursors.right.isDown) {
      this.directionPlayer(this.rightVelocity, 'right');

    } else {
      this.stopPlayer();
    }

    //Double jump
    if (this.player.body.onFloor()) {
      this.jumps = 1;
      this.jumping = false;
    }

    if (this.jumps > 0 && this.upInputIsActive(5)) {
      this.jumpPlayer(-420);
      this.jumping = true;
    }

    if (this.jumping && this.upInputIsReleased()) {
      this.jumps--;
      this.jumping = false;
    }
  }

  jumpPlayer (velocity) {
    this.player.body.velocity.y = velocity;
    this.jumpSound.play();
  }

  directionPlayer (velocity, animation) {
    this.player.body.velocity.x = velocity;
    this.player.animations.play(animation);
  }

  stopPlayer () {
    this.player.animations.stop();
    this.player.frame = 4;
  }

  collectStar (player, star) {
    star.body.enable = false;
    this.game.add.tween(star.scale).to({x:0}, 150).start();
    this.game.add.tween(star).to({y:100}, 150).start();

    this.coinSound.play();

    //Add and update the score
    this.score += 10;
    this.scoreText.text = 'Score: ' + this.score;
  }

  collectPower (player, enemies, power) {
    this.powerCollected = true;

    this.shakeEffect(this.player, 20);
    this.shout.play();
    this.levelMusic.stop();
    this.powerMusic.play();

    //Inoffensive enemies :3
    this.enemies.alpha = 0.2;

    //Rain (particles)
    this.emitter = this.game.add.emitter(game.world.centerX, 0, 400);
    this.emitter.width = this.game.world.width;
    this.emitter.makeParticles('rain');
    this.emitter.minParticleScale = 0.1;
    this.emitter.maxParticleScale = 0.5;
    this.emitter.setYSpeed(300, 500);
    this.emitter.setXSpeed(-5, 5);
    this.emitter.minRotation = 0;
    this.emitter.maxRotation = 0;
    this.emitter.start(false, 1600, 5, 0);

    this.power.kill();
  }

  enemyAttack () {
    this.shakeEffect(this.player, 20);
    this.hurt.play();

    this.live = this.lives.getFirstAlive();

    if (this.live) {
      this.live.kill();
      this.immunityTime = (new Date()).getTime() + 1000;
      this.player.tint = 0xff0004;
    } else {
      this.spriteBloodDeath(this.player);
      this.playerDeath();
    }
  }

  loadMap () {
    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('tiles', 'tiles');

    this.decorationLayer = this.map.createLayer('sky');
    this.platformsLayer = this.map.createLayer('collide');
    this.waterLayer = this.map.createLayer('background');

    this.waterLayer.resizeWorld();

    this.map.setCollisionBetween(1, 5000, true, 'collide');
  }

  loadPlayer () {
    this.player = this.game.add.sprite(40, this.game.world.height - 300, 'player');
    this.player.scale.setTo(0.8, 0.8);

    this.game.physics.arcade.enable(this.player);
    this.game.camera.follow(this.player);

    this.player.body.collideWorldBounds = true;

    this.player.animations.add('left', [0, 1, 2, 3], 20, true);
    this.player.animations.add('right', [5, 6, 7, 8], 20, true);

    this.player.body.bounce.y = 0.1;
    this.player.body.gravity.y = 1500;

    this.blockInputs = false;
  }

  loadStars () {
    this.stars = this.game.add.group();

    //We will enable physics for any star that is created in this group
    this.stars.enableBody = true;

    //Here we'll create 15 of them evenly spaced apart
    for (var i = 0; i < 9; i++)  {
      //Create a star inside of the 'stars' group
      this.star = this.stars.create(i * 170, 0, 'star');

      //Let gravity do its thing
      this.star.body.gravity.y = 300;

      //This just gives each star a slightly random bounce value
      this.star.body.bounce.y = 0.2;
    }
  }

  loadPower () {
    this.power = this.game.add.sprite(960, 80, 'power');
    this.game.physics.arcade.enable(this.power);
    this.power.body.gravity.y = 300;
  }

  loadSounds () {
    // Sounds
    this.coinSound = this.game.add.audio('coin', 1);
    this.jumpSound = this.game.add.audio('jump', 1);
    this.gameOver = this.game.add.audio('game_over', 0.6);
    this.splash = this.game.add.audio('splash', 1);
    this.hurt = this.game.add.audio('hurt', 1);
    this.shout = this.game.add.audio('shout', 3);
    // Music
    this.levelMusic = this.game.add.audio('level_music', 0.8);
    this.levelMusic.loop = true;
    this.levelMusic.play();

    this.powerMusic = this.game.add.audio('power_music', 1);
    this.powerMusic.loop = true;
  }

  upInputIsActive (duration) {
    this.isActive = this.input.keyboard.downDuration(Phaser.Keyboard.UP, duration);

    this.isActive |= (this.game.input.activePointer.justPressed(duration + 1000/60) &&
    this.game.input.activePointer.x > this.game.width/4 &&
    this.game.input.activePointer.x < this.game.width/2 + game.width/4);

    return this.isActive;
  }

  upInputIsReleased () {
    this.isReleased = this.input.keyboard.upDuration(Phaser.Keyboard.UP);
    this.isReleased |= this.game.input.activePointer.justReleased();

    return this.isReleased;
  }

  playerDeath () {
    this.blockInputs = true;

    this.state.start('Game')
    this.levelMusic.stop();
    this.powerMusic.stop();
    this.gameOver.play();
  }

  setParticles () {
    this.splashParticles = this.game.add.emitter(0, 0, 200);
    this.splashParticles.makeParticles('splash_particle');
    this.splashParticles.setYSpeed(-300, 30);
    this.splashParticles.setXSpeed(-80, 80);
    this.splashParticles.gravity = 0;

    this.blodParticles = this.game.add.emitter(0, 0, 200);
    this.blodParticles.makeParticles('blod_particle');
    this.blodParticles.setYSpeed(-300, 300);
    this.blodParticles.setXSpeed(-300, 300);
    this.blodParticles.gravity = 0;
  }

  playerSplashDeath () {
    this.player.kill();

    this.splashParticles.x = this.player.x + 10;
    this.splashParticles.y = this.player.y + 30;
    this.splashParticles.start(true, 150, null, 80);
    this.splash.play();

    //this.playerDeath();
  }

  spriteBloodDeath (sprite) {
    this.player.kill();

    this.blodParticles.x = this.player.x + 10;
    this.blodParticles.y = this.player.y + 30;
    this.blodParticles.start(true, 300, null, 300);
  }

  loadEnemies () {
    this.enemies = this.game.add.group();
    this.enemies.enableBody = true;

    this.enemy1 = this.enemies.create(290, 80, 'enemy_1');
    this.enemy1.body.gravity.y = 300;
    this.enemy1.body.velocity.x = 100;

    this.enemy2 = this.enemies.create(1200, 80, 'enemy_1');
    this.enemy2.body.gravity.y = 300;
    this.enemy2.body.velocity.x = 90;

    this.enemy3 = this.enemies.create(1500, 80, 'enemy_1');
    this.enemy3.body.gravity.y = 300;
    this.enemy3.body.velocity.x = 90;
  }

  updateEnemyMovement (){
    if (parseInt(this.enemy1.body.x) > 520 ) { this.enemy1.body.velocity.x = -100; }
    if (parseInt(this.enemy1.body.x) < 260 ) { this.enemy1.body.velocity.x = 230; }

    if (parseInt(this.enemy2.body.x) > 1200 ) { this.enemy2.body.velocity.x = -90; }
    if (parseInt(this.enemy2.body.x) < 1100 ) { this.enemy2.body.velocity.x = 90; }

    if (parseInt(this.enemy3.body.x) > 1600 ) { this.enemy3.body.velocity.x = -200; }
    if (parseInt(this.enemy3.body.x) < 1300 ) { this.enemy3.body.velocity.x = 300; }
  }

  initScoreCounter () {
    this.score = 0;
    this.scoreText = game.add.text(16, 16, 'Score: ' + this.score, { fontSize: '32px', fill: '#fff' });
    this.scoreText.fixedToCamera = true;
  }

  setLevelText (level) {
    this.levelText = game.add.text(game.camera.width - 130, 16, "Lvl: " + level, { fontSize: '22px', fill: '#fff' });
    this.levelText.fixedToCamera = true;
  }

  initLives () {
    this.livesText = game.add.text(16, 55, 'Lives:', { fontSize: '32px', fill: '#fff'});
    this.livesText.fixedToCamera = true;

    this.lives = game.add.group();
    this.lives.fixedToCamera = true;

    for (var i = 0; i < 3; i++) {
      this.lives.create(175 - (i * 30), 63, 'live');
    }
  }

  checkLevelPassed () {
    if (this.player.body.x > 4700 &&
      this.player.body.x < 4760 &&
      this.player.body.y > 1050 &&
      this.player.body.y < 1070)
    {
      this.levelMusic.stop();
      this.powerMusic.stop();
      this.game.state.start('levelPassed');
    }
  }

  shakeEffect (g, time) {
    var move = 5;

    this.game.add.tween(g)
      .to({y:"-"+move}, time).to({y:"+"+move*2}, time*2).to({y:"-"+move}, time)
      .to({y:"-"+move}, time).to({y:"+"+move*2}, time*2).to({y:"-"+move}, time)
      .to({y:"-"+move/2}, time).to({y:"+"+move}, time*2).to({y:"-"+move/2}, time)
      .start();

    this.game.add.tween(g)
      .to({x:"-"+move}, time).to({x:"+"+move*2}, time*2).to({x:"-"+move}, time)
      .to({x:"-"+move}, time).to({x:"+"+move*2}, time*2).to({x:"-"+move}, time)
      .to({x:"-"+move/2}, time).to({x:"+"+move}, time*2).to({x:"-"+move/2}, time)
      .start();
  }

}//fi
