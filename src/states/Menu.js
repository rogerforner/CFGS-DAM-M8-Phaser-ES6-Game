import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {
    //Title
    this.titleGame = this.game.make.text((this.game.camera.x + this.game.camera.width) / 2, 100, "Platform Game", {
      font: 'bold 60pt Arial',
      fill: '#000000',
      align: 'center'
    });
    this.titleGame.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleGame.anchor.set(0.5);
    
    //Button (Start)
    this.startGame = this.game.make.text((this.game.camera.x + this.game.camera.width) / 2, 250, "Start (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧", {
      font: 'bold 32pt Arial',
      fill: '#d00303',
      align: 'center'
    });
    this.startGame.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.startGame.anchor.set(0.5);
  }

  preload () {}

  create () {
    //Prevent the game from pausing
    this.game.stage.disableVisibilityChange = true;
    
    //Add title text
    this.game.add.existing(this.titleGame);
    
    //Add Start button
    this.startButton = this.game.add.existing(this.startGame);
    this.startButton.inputEnabled = true;
    this.startButton.events.onInputUp.add(function () {
      game.state.start('Game');
    });
  }
  
}//fi