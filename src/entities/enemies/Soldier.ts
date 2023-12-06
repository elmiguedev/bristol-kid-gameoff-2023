import { Scene } from "phaser";
import { Enemy } from "./Enemy";
import { BlobBullet } from "../generic/BlobBullet";

export class Soldier extends Enemy {
  private PATROL_RADIUS = 128;
  private DEFAULT_SPEED = 50;
  private FIRE_COUNTDOWN = 1000;
  private FIRE_SPEED = 700;

  private isFiring: boolean;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "enemy_soldier");
    this.patrolRadius = this.PATROL_RADIUS;
    this.patrolSpeed = this.DEFAULT_SPEED;
    this.isFiring = false;
    this.life = 3;
    this.configureHitbox();
  }

  public update() {
    super.update();
    this.checkFire();
  }

  private configureHitbox() {
    this.body.setSize(64, 110);
    this.body.setOffset(32, 18);
  }

  private checkFire() {
    if (!this.isFiring && this.isTargetVisible()) {
      this.fire();
    }
  }

  private fire() {
    this.isFiring = true;
    this.createBullet();
    this.setVelocityX(0);
    this.anims.play({
      key: "fire",
      frameRate: 30
    }, true);
    this.scene.time.addEvent({
      delay: this.FIRE_COUNTDOWN,
      callback: () => {
        this.isFiring = false;
        if (this.active)
          this.move(this.initialPosition.x > this.x ? 'right' : 'left');
      }
    });
  }

  private createBullet() {
    const bulletOffsetDistance = 32;
    const bulletOffset = this.body.velocity.x > 0 ? bulletOffsetDistance : -bulletOffsetDistance;
    const bulletX = this.x + bulletOffset;
    const bulletY = this.y - 74;
    const bullet = new BlobBullet(this.scene, bulletX, bulletY);
    bullet.setScale(0.6);
    this.bullets.add(bullet);
    const bulletVelocity = this.body.velocity.x > 0 ? 700 : -700;
    bullet.setVelocityX(bulletVelocity);
  }

  protected move(direction: 'left' | 'right') {
    super.move(direction);
    this.anims.play({
      key: "walk",
      frameRate: 10,
      repeat: -1
    }, true);
  }


}