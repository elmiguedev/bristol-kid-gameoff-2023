import { Enemy } from "./Enemy";

export class Zeppelin extends Enemy {

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "zeppelin");
    // this.playIdleAnimation();
    this.playOpenAnimation();
  }

  private playIdleAnimation() {
    this.anims.play({
      key: "idle",
      frameRate: 10,
      repeat: -1
    }, true);
  }

  private playOpenAnimation() {
    this.anims.play({
      key: "open",
      frameRate: 10,
      repeat: -1
    }, true);
  }
}