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

# importar archivo en app.component.ts y agregar MainScene a la config