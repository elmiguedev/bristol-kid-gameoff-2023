import { Enemy } from "../Enemy";

export class TankOMatic extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "tank_o_matic");
    this.life = 30
    this.playIdleAnimation();
  }

  private playIdleAnimation() {
    this.anims.play({
      key: "idle",
      frameRate: 10,
      repeat: -1
    }, true)
  }
}