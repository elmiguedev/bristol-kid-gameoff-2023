import { BlobBullet } from "../generic/BlobBullet";
import { Enemy } from "./Enemy";

export class Tank extends Enemy {
  private FIRE_DELAY: number = 2000;
  private isFiring: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "enemy_tank");
    this.life = 20;
    this.targetRadius = 700
    this.playAnimation();
  }

  public update() {
    super.update();
    this.checkFire();
  }

  private playAnimation() {
    this.anims.play({
      key: "with_canon",
      frameRate: 10,
      repeat: -1
    }, true);
  }

  private checkFire() {
    if (this.isTargetVisible() && !this.isFiring) {
      this.fire();
    }
  }

  private fire() {
    this.shakeTank();
    this.createBullet();
    this.setVelocityX(0);
    this.isFiring = true;
    this.scene.time.delayedCall(this.FIRE_DELAY, () => {
      this.isFiring = false;
      this.move(this.initialPosition.x > this.x ? 'right' : 'left');
    }, [], this);
  }

  private createBullet() {
    const bulletOffsetDistance = 100;
    const bulletOffset = this.body.velocity.x > 0 ? bulletOffsetDistance : -bulletOffsetDistance;
    const bulletX = this.x + bulletOffset;
    const bulletY = this.y - 110;
    const bullet = new BlobBullet(this.scene, bulletX, bulletY);
    this.bullets.add(bullet);
    const bulletVelocity = this.body.velocity.x > 0 ? 700 : -700;
    bullet.setVelocityX(bulletVelocity);
  }

  private shakeTank() {
    this.scene.add.tween({
      targets: this,
      angle: 3,
      duration: 50,
      yoyo: true,
      repeat: 4
    })
  }

}

