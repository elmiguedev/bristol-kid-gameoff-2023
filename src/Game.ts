import Phaser from "phaser";
import { LevelScene } from "./scenes/LevelScene/LevelScene";
import { BootloaderScene } from "./scenes/BootloaderScene";
import { GRAVITY } from "./utils/Constants";
import { GameOverScene } from "./scenes/GameOverScene";
import { LevelHud } from "./scenes/LevelScene/LevelHud";

export default new Phaser.Game({
  type: Phaser.CANVAS,
  width: 1280,
  height: 720,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  // backgroundColor: "#FFF",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: GRAVITY },
      debug: true
    }
  },
  render: {
    pixelArt: true
  },
  scene: [
    BootloaderScene,
    LevelScene,
    GameOverScene,
    LevelHud

  ]
})