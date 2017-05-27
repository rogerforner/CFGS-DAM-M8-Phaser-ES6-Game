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
    this.load.image('tiles', '/assets/images/tiles.png');
    this.load.image('coin', 'assets/images/coin.png');

    this.load.image('dust', 'assets/images/dust.png');
    this.load.image('exp', 'assets/images/exp.png');

    this.load.spritesheet('player', 'assets/images/player.png', 28, 22);
    this.load.image('enemy', 'assets/images/enemy.png');

    this.load.image('enemy', 'assets/images/touch/jump.png');
    this.load.image('enemy', 'assets/images/touch/left.png');
    this.load.image('enemy', 'assets/images/touch/right.png');

    /**
     * Audio
     */
    this.load.audio('music', ['assets/audio/awesomeness.wav', 'assets/audio/awesomeness.mp3']);
    this.load.audio('dead', ['assets/audio/dead.wav', 'assets/audio/dead.mp3']);
    this.load.audio('dust', ['assets/audio/dust.wav', 'assets/audio/dust.mp3']);
    this.load.audio('jump', ['assets/audio/jump.wav', 'assets/audio/jump.mp3']);
    this.load.audio('coin', ['assets/audio/coin.wav', 'assets/audio/coin.mp3']);
  }

  create () {
    this.state.start('Game')
  }
}
