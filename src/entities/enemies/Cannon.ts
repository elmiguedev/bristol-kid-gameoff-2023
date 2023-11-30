import { PaperBomb } from "../generic/PaperBomb";
import { Enemy } from "./Enemy";

export class Cannon extends Enemy {

  private isFiring: boolean = false;
  private fireCountdown: number = 2000;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "cannon");
    this.life = 5
    this.targetRadius = this.width * 3

  }

  public update() {
    super.update();
    this.checkFire();
  }

  private checkFire() {
    if (!this.isFiring && this.isTargetVisible()) {
      this.fire();
    }
  }

  protected isTargetVisible() {
    if (!this.target) return false;
    if (this.target.x < this.x && this.target.x > this.x - this.targetRadius) {
      return true;
    }
    return false;
  }

  private fire() {
    this.isFiring = true;
    this.createPaperBomb();
    this.playFireAnimation();
    this.scene.time.delayedCall(this.fireCountdown, () => {
      this.isFiring = false;
    })
  }

  private createPaperBomb() {
    const bulletOffsetDistance = 32;
    const bulletOffset = -bulletOffsetDistance;
    const bulletX = this.x + bulletOffset;
    const bulletY = this.y - 74;
    const bullet = new PaperBomb(this.scene, bulletX, bulletY);
    this.bullets.add(bullet);
    bullet.setVelocity(-600, -400);
  }

  private playFireAnimation() {
    this.anims.play({
      key: "fire",
      frameRate: 10,
      repeat: -1
    })
  }
}