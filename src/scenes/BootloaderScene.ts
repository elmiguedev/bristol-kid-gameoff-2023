import KidPng from "../assets/sprites/kid/kid.png";
import KidJson from "../assets/sprites/kid/kid.json";
import TilesetPng from "../assets/tilesets/tileset.png";
import LevelsJson from "../assets/tilemaps/levels.json";
import SoldierPng from "../assets/sprites/enemies/soldier/soldier.png";
import SoldierJson from "../assets/sprites/enemies/soldier/soldier.json";
import BulletPng from "../assets/sprites/generic/bullet.png";
import TankPng from "../assets/sprites/enemies/tank/tank.png";
import TankJson from "../assets/sprites/enemies/tank/tank.json";
import CanonPng from "../assets/sprites/enemies/tank/canon/canon.png";
import BlobBulletPng from "../assets/sprites/generic/blob_bullet/blob_bullet.png";
import BlobBulletJson from "../assets/sprites/generic/blob_bullet/blob_bullet.json";
import PooBulletPng from "../assets/sprites/generic/poo_bullet/poo_bullet.png";
import PooBulletJson from "../assets/sprites/generic/poo_bullet/poo_bullet.json";


export class BootloaderScene extends Phaser.Scene {
  constructor() {
    super("BootloaderScene");
  }

  preload() {
    this.load.aseprite("kid", KidPng, KidJson);
    this.load.aseprite("enemy_soldier", SoldierPng, SoldierJson);
    this.load.aseprite("enemy_tank", TankPng, TankJson);
    this.load.aseprite("blob_bullet", BlobBulletPng, BlobBulletJson);
    this.load.aseprite("poo_bullet", PooBulletPng, PooBulletJson);
    this.load.image("canon", CanonPng);
    this.load.image("tileset", TilesetPng);
    this.load.tilemapTiledJSON("levels", LevelsJson);
    this.load.image("bullet", BulletPng);
    this.load.on("complete", () => {
      this.scene.start("LevelScene");
    })
  }
}