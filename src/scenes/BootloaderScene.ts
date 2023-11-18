import KidPng from "../assets/sprites/kid/kid.png";
import KidJson from "../assets/sprites/kid/kid.json";
import TilesetPng from "../assets/tilesets/tileset.png";
import LevelsJson from "../assets/tilemaps/levels.json";
import PooBulletPng from "../assets/sprites/poo/poo_bullet/poo_bullet.png"
import EnemySoldierPng from "../assets/sprites/enemies/soldier/soldier.png";
import EnemySoldierJson from "../assets/sprites/enemies/soldier/soldier.json";
import BulletPng from "../assets/sprites/generic/bullet.png";

export class BootloaderScene extends Phaser.Scene {
  constructor() {
    super("BootloaderScene");
  }

  preload() {
    this.load.aseprite("kid", KidPng, KidJson);
    this.load.aseprite("enemy_soldier", EnemySoldierPng, EnemySoldierJson);
    this.load.image("tileset", TilesetPng);
    this.load.tilemapTiledJSON("levels", LevelsJson);
    this.load.image("poo_bullet", PooBulletPng);
    this.load.image("bullet", BulletPng);
    this.load.on("complete", () => {
      this.scene.start("LevelScene");
    })
  }
}