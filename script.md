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
        gravity: { y: 500 }
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
  this.load.setBaseURL('assets/');

  this.load.image('background', 'bg1.png');

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
# agregamos abajo de la pantalla
  this.physics.add.image(128, 208, 'ground');

# el suelo se cae con mario, porque no deja de ser una imagen con propiedades fisicas
# para elementos que no queremos que se muevan, que es lo que viene a ser el suelo, phaser tiene una clase que es static image
  this.physics.add.staticImage(128, 208, 'ground')

# mario sigue atravesando el suelo, porque falta un elemento más que es un collider (una clase que le dice al juego qué objetos colisionan entre sí)

# para empezar vamos a guardar una referencia a mario y al suelo en la escena

  mario!: Phaser.Physics.Arcade.Image;

  this.mario = this.physics.add.image(100, 100, 'mario');
  let ground = this.physics.add.staticImage(128, 208, 'ground')

# ahora agregamos el collider entre los dos objetos
  this.physics.add.collider(this.mario, this.ground);

# y ahora mario se queda parado en el suelo


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

# primero agregar mas plataformas
  this.load.image('block', 'block.png');

# vamos a convertir el suelo en un staticgroup que sirve para agrupar varios elementos que comparten propiedades fisicas

let ground = this.physics.add.staticGroup()

# le agregamos el suelo antiguo como parte del grupo
  ground.create(128, 208, 'ground');

# agregar nuevos bloques al staticgroup
    ground.create(40, 184, 'block');
    ground.create(56, 184, 'block');
    ground.create(72, 184, 'block');
    ground.create(56, 168, 'block');
  
# mas plataformas
    ground.create(168, 88, 'block');
    ground.create(184, 88, 'block');
    ground.create(200, 88, 'block');


# quiero introducir dos conceptos mas, sistemas de particulas y tweens
# y voy a empezar por los tweens porque tienen un nombre gracioso

# quiero mover las monedas arriba y abajo 

# crear array vacio
  coinsArray: Phaser.Physics.Arcade.Sprite[] = [];

# en la funcion de crear monedas
  this.coinsArray.push(coin);
# al final:  
    return coin;

# agregar coins al array:

this.coinsArray.push(
      this.addCoin(168, 136),
      this.addCoin(184, 136),
      this.addCoin(200, 136)
    );

# crear tween
# explicar cada propiedad
this.tweens.add({
      targets: this.coinsArray,
      y: 152,
      duration: 1000,
      repeat: -1,
    });

# agregar yoyo para que vaya y venga

  yoyo: true


# cambiar ease para que no sea lineal
# explicar por encima que es y mostrar varias

  ease: 'Sine.easeInOut'
  
# explicar que los tweens son poderosos y cambian mucho mas que la posicion
- rotacion
- color
- tamaño


# Crear bloque de ladrillos



# Mostrar modo debug para ver colisiones
debug:true en config de arcade

# Bloques de ladrillo que se rompen para introducir particulas
  this.load.image('brick', 'brick.png');
  this.load.image('particle', 'particle.png');

  al final de create:

  let brick = this.physics.add.staticImage(56, 88, 'brick');
    
  this.physics.add.collider(this.mario, brick, () => {
    if (this.mario.body.blocked.up) {
      brick.destroy();
    }
  });

  # no queremos que el bloque desaparezca sin mas
  # agregamos particulas
arriba del collider

  let particleManager = this.add.particles('particle');

  # el manager no hace nada asi que creamos un emitter 

  let emitter = particleManager.createEmitter({
      
  })
    
# explicar las propiedades.
# queremos particulas que vayan hacia arriba y caigan
lifespan: 2000,
speed: 300,

# mover para que se vea

  emitter.setPosition(100,100)

# queremos particulas que vayan hacia arriba y caigan
speedY: { min: -300, max: -200 },
speedX: { min: -200, max: 200 },
gravityY: 800

# ya tenemos lo que queremos asi que podemos apagarlo
on: false;

# lo disparamos al romper el bloque 
emitter.explode( 8, brick.x, brick.y);

# movemos a funcion aparte 
private addBrick(x: number, y: number, emitter: any) {
    let brick = this.physics.add.staticImage(x, y, 'brick');
    this.physics.add.collider(this.mario, brick, () => {
      if (this.mario.body.blocked.up) {
        emitter.explode( 8, x, y);
        brick.destroy();
      }
    });
  }


# creamos mas bloques
    this.addBrick(40, 88, emitter);
    this.addBrick(56, 88, emitter);
    this.addBrick(72, 88, emitter);


# FINAL THING
# vamos a agregar una pantalla de titulo

# crear TitleScene.ts

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }
  
  preload() {

  }

  create() {
    
  }

}

# cargar assets
  this.load.setBaseURL('assets/');
  this.load.image('background', 'title.png');
  this.load.image('start', 'start.png');

# crear fondo y boton

  this.add.image(0, 0, 'title').setOrigin(0, 0);
  let button = this.add.image(128, 144, 'start');

# agregar interaccion

button.setInteractive();

    button.on('pointerdown', () => {
      this.scene.start('MainScene')
    })


# THE END



# fade out?
button.on('pointerdown', () => {
      this.cameras.main.fadeOut(300);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.start('MainScene');
      });
    });



# mario no se cae por el borde
    this.mario.setCollideWorldBounds(true)