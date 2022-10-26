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