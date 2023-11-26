import { Bullet } from "./Bullet";

export class BlobBullet extends Bullet {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "blob_bullet")
  }
}