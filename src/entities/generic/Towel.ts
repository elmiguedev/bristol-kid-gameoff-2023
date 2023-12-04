import { Bullet } from "./Bullet";

export class Towel extends Bullet {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "towel");
  }
}