export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  mario!: Phaser.Physics.Arcade.Sprite;
  ground!: Phaser.Physics.Arcade.StaticGroup;
  keys!: any;
  score = 0;
  scoreCounter!: Phaser.GameObjects.Text;

  init() {

  }

  preload() {
    this.load.setBaseURL('assets/');

    this.load.image('background', 'bg1.png');

    this.load.image('mario', 'big_idle.png');
    this.load.image('ground', 'ground.png');
    this.load.image('block', 'block.png');
    this.load.image('coin_1', 'coin_1.png');
    this.load.image('coin_2', 'coin_2.png');
    this.load.image('coin_3', 'coin_3.png');
    this.load.spritesheet('mario_sheet', 'big_mario.png', {frameWidth: 16, frameHeight: 27});
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0);
    
    this.mario = this.physics.add.sprite(100, 100, 'mario');
    this.ground = this.physics.add.staticGroup({
      key: 'ground',
      frameQuantity: 16
    });

    Phaser.Actions.PlaceOnLine(
      this.ground.getChildren(),
      new Phaser.Geom.Line(8, 224-16, 256+8, 224-16)
    );
    this.ground.refresh();

    this.ground.create(40, 184, 'block');
    this.ground.create(56, 184, 'block');
    this.ground.create(72, 184, 'block');
    this.ground.create(56, 168, 'block');

    this.ground.create(168, 88, 'block');
    this.ground.create(184, 88, 'block');
    this.ground.create(200, 88, 'block');

    this.physics.add.collider(this.mario, this.ground);

    this.keys = this.input.keyboard.addKeys('A, LEFT, RIGHT');
    this.createAnimations();

    this.addCoin(168, 136);
    this.addCoin(184, 136);
    this.addCoin(200, 136);

    this.scoreCounter = this.add.text(8,4, `COINS: ${this.score}`, { font: '12px Consolas', color: '#000000' });
  }
  
  override update() {
    let direction = -this.keys.LEFT.isDown + this.keys.RIGHT.isDown;

    this.mario.setVelocityX(120 * direction);

    if (direction != 0) this.mario.flipX = direction == 1;

    if (this.keys.A.isDown && this.mario.body.blocked.down) {
      this.mario.setVelocityY(-300);
    } else if (this.keys.A.isUp && this.mario.body.velocity.y < 0) {
      this.mario.setVelocityY(this.mario.body.velocity.y/2);
    }

    if (!this.mario.body.blocked.down) {
      this.mario.play('mario_jump');
    } else {
      if (direction == 0) {
        this.mario.play('mario_idle');
      } else {
        if (this.mario.anims.currentAnim.key != 'mario_walk') this.mario.play('mario_walk');
      }
    }
  }

  private addCoin(x: number, y: number) {
    let coin = this.physics.add.staticSprite(x, y, 'coin_1');
    coin.play('coin_spin');

    this.physics.add.overlap(coin, this.mario, () => {
      this.score++;
      this.scoreCounter.text = `COINS: ${this.score}`
      coin.destroy();
    })
  }

  private createAnimations() {
    this.anims.create({
      key: 'coin_spin',
      frameRate: 8,
      repeat: -1,
      frames: [
        { key: 'coin_1' },
        { key: 'coin_2' },
        { key: 'coin_3' },
        { key: 'coin_2' },
      ]
    });

    this.anims.create({
      key: 'mario_walk',
      frameRate: 30,
      repeat: -1,
      frames: this.anims.generateFrameNumbers('mario_sheet', { frames: [0, 1, 2, 2, 1, 0] })
    });

    this.anims.create({
      key: 'mario_idle',
      frameRate: 30,
      repeat: -1,
      frames: this.anims.generateFrameNumbers('mario_sheet', { frames: [0] })
    });

    this.anims.create({
      key: 'mario_jump',
      frameRate: 30,
      repeat: -1,
      frames: this.anims.generateFrameNumbers('mario_sheet', { frames: [3] })
    });

    this.anims.create({
      key: 'mario_death',
      frameRate: 30,
      repeat: -1,
      frames: this.anims.generateFrameNumbers('mario_sheet', { frames: [4] })
    });
  }
}