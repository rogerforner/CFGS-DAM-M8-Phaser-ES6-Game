/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}
  preload () {
    this.game.load.tilemap('level2', '/assets/levels/level2.json', null, Phaser.Tilemap.TILED_JSON);
  }

  create () {
    this.createMap()
  }

  createMap() {
    this.map = this.game.add.tilemap('level2');
    this.map.addTilesetImage('tiles', 'tiles');

    this.map.createLayer('sky')
    this.map.createLayer('collide')
    this.map.createLayer('background')

    this.map.setCollisionBetween(1, 5000, true, 'collide');
  }

  render () {}
}
