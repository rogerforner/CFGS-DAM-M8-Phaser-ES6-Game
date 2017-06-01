import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg');
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');
    centerGameObjects([this.loaderBg, this.loaderBar]);

    this.load.setPreloadSprite(this.loaderBar);
    //
    // load your assets
    //
    /**
     * Images
     */
    this.load.image('tiles', 'assets/images/tiles.png');
    
    this.load.image('blod_particle', 'assets/images/blod_particle.jpg');
    this.load.image('rain', 'assets/images/rain.png');

    this.load.image('star', 'assets/images/star.png');
    this.load.image('live', 'assets/images/live.png');
    this.load.image('power', 'assets/images/power.png');
    this.load.image('goal', 'assets/images/goal.png');

    this.load.spritesheet('player', 'assets/images/dude.png', 32, 48);
    this.load.image('enemy_1', 'assets/images/enemySpikey_1.png');

    /**
     * Audio
     */
    this.load.audio('level_music', ['assets/audio/level_music.wav']);
    this.load.audio('power_music', ['assets/audio/power_music.wav']);
    this.load.audio('jump', ['assets/audio/jump.wav']);
    this.load.audio('coin', ['assets/audio/coin.wav']);
    this.load.audio('game_over', ['assets/audio/game_over_a.wav']);
    this.load.audio('hurt', ['assets/audio/wrong.wav']);
    this.load.audio('shout', ['assets/audio/shout.wav']);
    this.load.audio('game_goal', ['assets/audio/goal.wav']);
  }

  create () {
    this.state.start('Menu')
  }
}
