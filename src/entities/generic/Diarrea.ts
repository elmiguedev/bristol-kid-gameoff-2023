import { Bullet } from "./Bullet";

export class Diarrea extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "diarrea")
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setBounce(1, 0);
    this.anims.createFromAseprite("diarrea");

  }

  public update() {
    if (this.body.blocked.down) {
      this.playFloorAnimation()
    } else {
      this.playFallingAnimation()
    }
  }

  private playFallingAnimation() {
    this.anims.play({
      key: "falling",
      frameRate: 20,
      repeat: -1
    }, true)
  }

  private playFloorAnimation() {
    this.anims.play({
      key: "floor",
      frameRate: 20,
      repeat: -1
    }, true)
  }
}