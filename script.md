#  Mencionar que es una app de angular vacia, con estilo basico para que este el juego centrado
# mostrar html y css. div con id mario
# copiar config, explicar cada campo

config: Phaser.Types.Core.GameConfig = {
    title: "Super Mario Phaser",
    type: Phaser.WEBGL,
    width: 256,
    height: 224,
    scene: [ ],
    parent: 'mario',
    backgroundColor: "#001122",
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 1000 }
      }
    }
  };

# agregar propiedad 
  game!: Phaser.Game;
# agregar a on init:
  this.game = new Phaser.Game(this.config);

#  ver resultado, juego diminuto

# agregar a la config 
  zoom: 3

# crear carpeta scenes
# crear archivo MainScene.ts

SI INIT NO SE USA, NO INCLUIRLA

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  init() {

  }

  preload() {

  }

  create() {

  }
  
  override update() {

  }
}

# explicar cada funcion y que hace 

# explicar el orden, demostrar con console.log en cada una

# Preload background en la escena
  this.load.setBaseURL('assets/smw/');

  this.load.image('background', 'assets/smw/lv1_background.png');

# agregar fondo en create()
  this.add.image(0, 0, 'background');

# Explicar que lo que falta es conectar la escena con el juego
  agregar MainScene a la config

# mostrar como esta mal centrado y explicar que el origen de las imagenes esta en su centro, se puede cambiar con setOrigin()
  this.add.image(0, 0, 'background').setOrigin(0,0);

_first commit_

# Crear un mario

  this.add.image(100, 100, 'mario');

# es una imagen estatica, no hace nada
# vamos a hacer que sea un objeto fisico
# explicar que phaser tiene un motor de fisicas

  this.physics.add.image(100, 100, 'mario');

# mario se cae, porque ahora tiene fisicas y le afecta la gravedad
# estaria bueno tener un suelo
# cargamos la imagen
  this.load.image('ground', 'ground.png');
# agregamos justo abajo de mario
  this.physics.add.image(100, 208, 'ground');
# y a partir de ahora a todas las cosas que sean parte del escenario vamos a ponerle el origen en la esquina superior izquierda para trabajar mas facil con las posiciones
  this.physics.add.image(96, 208, 'ground')
# el suelo se cae con mario, porque no deja de ser una imagen con propiedades fisicas
# para elementos que no queremos que se muevan, que es lo que viene a ser el suelo, phaser tiene una clase que es static image
  this.physics.add.staticImage(96, 208, 'ground')

# mario sigue atravesando el suelo, porque falta un elemento más que es un collider (una clase que le dice al juego qué objetos colisionan entre sí)

# para empezar vamos a guardar una referencia a mario y al suelo en la escena

  mario!: Phaser.Physics.Arcade.Image;
  ground!: Phaser.Physics.Arcade.Image;

  this.mario = this.physics.add.image(100, 100, 'mario');
  this.ground = this.physics.add.staticImage(104, 208, 'ground').setOrigin(0,0);

# ahora agregamos el collider entre los dos objetos
  this.physics.add.collider(this.mario, this.ground);

# y ahora mario se queda parado en el suelo


# Ahora vamos a extender el suelo
# podriamos copiar y pegar varias veces esta linea cambiando la posición pero hay una mejor forma de hacerlo que es con un staticgroup

this.ground = this.physics.add.staticGroup({
      key: 'ground',
      frameQuantity: 16
    })

# y cambiamos el tipo de la propiedad
  ground!: Phaser.Physics.Arcade.StaticGroup;

# linea magica warning:
# queremos que estos 16 bloques de suelo esten en una linea recta, asi que podemos hacerlo con código:

  Phaser.Actions.PlaceOnLine(

  );

# a esta funcion le pasamos un array de objetos como primer argumento

Phaser.Actions.PlaceOnLine(
      this.ground.getChildren(),
      
    );

# y el segundo argumento es una linea
 dibujitos con tablet en paint para explicar el posicionamiento
 recordar que en el ultimo punto de la linea no se pone nada

 Phaser.Actions.PlaceOnLine(
      this.ground.getChildren(),
      new Phaser.Geom.Line(8, 224-16, 256+8, 224-16)
    );

# Ahora tiramos otra linea magica que es 

    this.ground.refresh();

# esto lo que hace es actualizar la posición fisica de cada uno de los componentes del staticgroup, si no la pusieramos entonces veríamos lo mismo, pero para el motor de fisicas sería como si nunca se hubieran movido de la posicion por defecto, que es  0,0

explicar quitando y poniendo como funciona

# pero bueno, tenemos a mario, tenemos un suelo, para que esto sea un juego le falta lo mas importante no? el input

# primero agregamos una propiedad que sea keys

 keys!: any;


this.keys = this.input.keyboard.addKeys('A, LEFT, RIGHT');

# luego en UPDATE
if (this.keys.RIGHT.isDown) {
      this.mario.setVelocityX(120)
    } else if (this.keys.LEFT.isDown) {
      this.mario.setVelocityX(-120)
    } else {
      this.mario.setVelocityX(0)
    }

# ta feito asi que vamos a hacerlo mejor

let direction = this.keys.RIGHT.isDown - this.keys.LEFT.isDown;
    this.mario.setVelocityX(120 * direction);

# ya que tenemos direccion, hacer que mire en direccion correcta escalando en X (escala negativa hace que se invierta)
# sprite original mira a la izquierda, hay que invertir direccion

this.mario.flipX = direction == 1;

# no queremos que siempre termine mirando a la izquierda
if (direction != 0) this.mario.flipX = direction == 1;

# agregar salto 
if (this.keys.A.isDown) {
      this.mario.setVelocityY(-300);
    }

# salto infitino y mario vuelve a su planeta si dejas apretado. agregar blocked down, true cuando esta colisionando contra algo por abajo

if (this.keys.A.isDown && this.mario.body.blocked.down) {
      this.mario.setVelocityY(-300);
    }

# queremos controlar la altura del salto si soltamos A y sigue subiendo

if (this.keys.A.isDown && this.mario.body.blocked.down) {
      this.mario.setVelocityY(-300);
    } else if (this.keys.A.isUp && this.mario.body.velocity.y < 0) {
      this.mario.setVelocityY(0);
    }

# muy brusco, mejor dividir entre 2

if (this.keys.A.isDown && this.mario.body.blocked.down) {
      this.mario.setVelocityY(-300);
    } else if (this.keys.A.isUp && this.mario.body.velocity.y < 0) {
      this.mario.setVelocityY(this.mario.body.velocity.y/2);
    }

# tenemos un juego! 
# pero es aburrido
# agreguemos monedas que den puntos
  score = 0;
  
  this.load.image('coin_1', 'coin_1.png');

# agregamos moneda
  let coin = this.physics.add.staticImage(168, 136, 'coin_1');

# un collider con un callback para que al tocarla aumente puntaje y se destruya

this.physics.add.collider(coin, this.mario, () => {
      this.score++;
      coin.destroy();
    })

# no queremos que mario se detenga al golpear la moneda asi que usamos overlap

this.physics.add.overlap(coin, this.mario, () => {
      this.score++;
      coin.destroy();
    })

# mover a funcion aparte para poder añadir mas

private addCoin(x: number, y: number) {
    let coin = this.physics.add.staticImage(x, y, 'coin_1');

    this.physics.add.overlap(coin, this.mario, () => {
      this.score++;
      coin.destroy();
    })
  }

# mostrar puntaje en texto

  scoreCounter!: Phaser.GameObjects.Text;


# agregar a callback de moneda
   this.scoreCounter = this.add.text(8,4, `COINS: ${this.score}`, { font: '12px Consolas', color: '#000000' });

      this.scoreCounter.text = `COINS: ${this.score}`


# vamos a animar monedas y asi introducimos animacion


    this.load.image('coin_2', 'coin_2.png');
    this.load.image('coin_3', 'coin_3.png');

# creamos animacion

this.anims.create({
      key: 'coin_spin',
      frameRate: 8,
      repeat: -1,
      frames: [
        { key: 'coin_1' },
        { key: 'coin_2' },
        { key: 'coin_3' },
      ]
    })


# Las imagenes son imagenes estáticas, si queremos agregar animaciones tenemos que usar la clase Sprite en su lugar, porque la clase Image no tiene un componente de animacion

# cambiar staticImage por staticSprite

    let coin = this.physics.add.staticSprite(x, y, 'coin_1');
    
    coin.play('coin_spin');


# vamos a animar a mario no?

  mario!: Phaser.Physics.Arcade.Sprite;

  this.mario = this.physics.add.sprite(100, 100, 'mario');

# esta vez vamos a usar un metodo mejor para importar y crear animaciones, con spritesheets

# importamos spritesheet, la muestro para que vean y explico los frames


  this.load.spritesheet('mario_sheet', 'big_mario.png', {frameWidth: 16, frameHeight: 27});

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

# Play animations in update
# empezar por la de salto si no esta en el suelo, luego idle, else caminar
if (!this.mario.body.blocked.down) {
      this.mario.play('mario_jump');
    } else {
      if (direction == 0) {
        this.mario.play('mario_idle');
      } else {
        if (this.mario.anims.currentAnim.key != 'mario_walk') this.mario.play('mario_walk');
      }
    }


# ahora es mas bonito
# pero no es muy divertido

# primero agregar plataformas
  this.load.image('block', 'block.png');

# agregar nuevos bloques al staticgroup
    this.ground.create(40, 184, 'block');
    this.ground.create(56, 184, 'block');
    this.ground.create(72, 184, 'block');
    this.ground.create(56, 168, 'block');
  
# mas plataformas
    this.ground.create(168, 88, 'block');
    this.ground.create(184, 88, 'block');
    this.ground.create(200, 88, 'block');


# Bloques de ladrillo que se rompen para introducir particulas