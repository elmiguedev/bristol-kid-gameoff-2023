import { GRAVITY } from "../../utils/Constants";
import { BlobBomb } from "../generic/BlobBomb";
import { BlobBullet } from "../generic/BlobBullet";
import { Enemy } from "./Enemy";

export class TrenchSoldier extends Enemy {

  private isFiring: boolean = false;
  private fireCountdown: number = 500;
  private bombCountdown: number = 2000;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "trench_soldier");
    this.isFiring = false;
    this.life = 4;
    this.targetRadius = this.width * 3
  }

  public update() {
    super.update();
    this.checkFire();
  }

  private checkFire() {
    if (!this.isFiring && this.isTargetVisible()) {
      if (Math.random() > 0.2) {
        this.fire();
      } else {
        this.bomb();
      }
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
    this.createBullet();
    this.playFireAnimation();
    this.scene.time.delayedCall(this.fireCountdown, () => {
      this.isFiring = false;
    })
  }

  private createBullet() {
    const bulletOffsetDistance = 32;
    const bulletOffset = this.body.velocity.x > 0 ? bulletOffsetDistance : -bulletOffsetDistance;
    const bulletX = this.x + bulletOffset;
    const bulletY = this.y - 74;
    const bullet = new BlobBullet(this.scene, bulletX, bulletY);
    bullet.setScale(0.3);
    this.bullets.add(bullet);
    const bulletVelocity = this.body.velocity.x > 0 ? 700 : -700;
    bullet.setVelocityX(bulletVelocity);
  }

  private bomb() {
    this.isFiring = true;
    this.createBomb();
    this.playBombAnimation();
    this.scene.time.delayedCall(this.bombCountdown, () => {
      this.isFiring = false;
    })
  }

  private createBomb() {
    const bulletOffsetDistance = 32;
    const bulletOffset = -bulletOffsetDistance;
    const bulletX = this.x + bulletOffset;
    const bulletY = this.y - 74;
    const bullet = new BlobBomb(this.scene, bulletX, bulletY, this.bullets);
    this.bullets.add(bullet);
    bullet.setVelocity(-600, -400);
    // @ts-ignore
    bullet.body.allowGravity = true;
  }

  private playFireAnimation() {
    this.anims.play({
      key: "fire",
      frameRate: 30
    }, true);
  }

  private playBombAnimation() {
    this.anims.play({
      key: "bomb",
      frameRate: 30
    }, true);
  }
}