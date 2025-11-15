import Phaser from 'phaser';

export class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.image('obstacle', 'assets/obstacle.png');
  }

  create() {
    this.scene.start('game');
  }
}
