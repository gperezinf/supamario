export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  init() {

  }

  preload() {
    this.load.setBaseURL('assets/smw/');
    this.load.image('background', 'lv1_background.png');
    this.load.spritesheet('key', 'url', {frameWidth: 16, frameHeight: 16 })
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0);
  }
  
  override update() {

  }
}