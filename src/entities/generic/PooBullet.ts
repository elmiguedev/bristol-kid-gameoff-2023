import { Bullet } from "./Bullet";

export class PooBullet extends Bullet {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "poo_bullet")
  }
}