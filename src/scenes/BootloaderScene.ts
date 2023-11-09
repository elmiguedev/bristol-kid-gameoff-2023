import KidPng from "../assets/sprites/kid/kid.png";
import KidJson from "../assets/sprites/kid/kid.json";
import TilesetPng from "../assets/tilesets/tileset.png";
import LevelsJson from "../assets/tilemaps/levels.json";

export class BootloaderScene extends Phaser.Scene {
  constructor() {
    super("BootloaderScene");
  }

  preload() {
    this.load.aseprite("kid", KidPng, KidJson);
    this.load.image("tileset", TilesetPng);
    this.load.tilemapTiledJSON("levels", LevelsJson);
    this.load.on("complete", () => {
      this.scene.start("LevelScene");
    })
  }
}