import { MainScene } from "../Scenes/MainScene";

export class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor(
    x: number, 
    y: number, 
    scene: MainScene,
  ) {
    super(scene, x, y, 'coin');
    scene.physics.add.collider(this, scene.mario, function(this: Coin) {
      scene.score++;
      this.destroy();
    })
  }
}