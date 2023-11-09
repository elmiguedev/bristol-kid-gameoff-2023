import Phaser from "phaser";
import { LevelScene } from "./scenes/LevelScene";
import { BootloaderScene } from "./scenes/BootloaderScene";

export default new Phaser.Game({
  type: Phaser.CANVAS,
  width: 1280,
  height: 720,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: "#FFF",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1000 },
      debug: true
    }
  },
  scene: [
    BootloaderScene,
    LevelScene

  ]
})