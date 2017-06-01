import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {
    //Title
    this.titleGame = this.game.make.text(this.game.world.centerX, 100, "Congrats!", {
      font: 'bold 60pt Arial',
      fill: '#000000',
      align: 'center'
    });
    this.titleGame.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleGame.anchor.set(0.5);
    
    //Button (Menu)
    this.menuGame = this.game.make.text(this.game.world.centerX, 250, "You are a winner! ♥‿♥", {
      font: 'bold 32pt Arial',
      fill: '#d00303',
      align: 'center'
    });
    this.menuGame.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.menuGame.anchor.set(0.5);
  }

  preload () {}

  create () {
    //Prevent the game from pausing
    this.game.stage.disableVisibilityChange = true;
    
    //Add title text
    this.game.add.existing(this.titleGame);
    
    //Add Start button
    this.menuButton = this.game.add.existing(this.menuGame);
    
    this.menuButton.inputEnabled = true;
    
    this.menuButton.events.onInputUp.add(function () {
      game.state.start('Menu')
    });
  }
  
}
