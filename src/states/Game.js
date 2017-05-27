/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.game.load.tilemap('level1', '/assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
  }

  create () {
    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.cursor = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.RIGHT, Phaser.Keyboard.LEFT]);

    //-------------------------
    this.createMap();
    this.createMapMusic();
    this.createMapSounds();

    this.createPlayer();
  }

  update () {
    this.physics.arcade.collide(this.player, this.collideLayer);

    this.inputs();
  }

  render () {
    if (__DEV__) {}
  }

  /**
   * MAP
   ********************************************************************************************************************/
  createMap () {
    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('tiles', 'tiles');

    this.skyLayer = this.map.createLayer('sky');
    this.collideLayer = this.map.createLayer('collide');
    this.bgLayer = this.map.createLayer('background');

    this.map.setCollisionBetween(1, 5000, true, 'collide');
  }

  createMapMusic () {
    this.gameMusic = this.game.add.audio('music');
    this.gameMusic.loop = true;
    this.gameMusic.play();
  }

  createMapSounds () {
    this.deadSound = this.add.audio('dead', 0.1);
    this.jumpSound = this.add.audio('jump', 0.1);
    this.dustSound = this.add.audio('dust', 0.1);
    this.coinSound = this.add.audio('coin', 0.1);
  }

  /**
   * PLAYERS
   ********************************************************************************************************************/
  createPlayer () {
    this.player = this.add.sprite(32, 0, 'player');

    this.physics.arcade.enable(this.player);

    this.player.body.gravity.y = 600;
    this.collideLayer.body.immovable = true;

    this.player.animations.add('idle', [3, 4, 5, 4], 5, true);

  }

  spawnPlayer () {}

  createEnemy() {}

  /**
   * EFFECTS
   ********************************************************************************************************************/
  /**
   * PARTICLES
   ********************************************************************************************/
  setParticles () {}

  shakeEffect (g) {}

  /**
   * OBJECTS
   ********************************************************************************************************************/
  /**
   * COINS
   ********************************************************************************************/
  addCoins () {}

  takeCoin (a, b) {}

  /**
   * CONTROLLERS
   ********************************************************************************************************************/
  /**
   * INPUTS
   ********************************************************************************************/

}//fi
