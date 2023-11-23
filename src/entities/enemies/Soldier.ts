import { Scene } from "phaser";
import { Enemy } from "./Enemy";

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
    this.setOrigin(0.5, 1);

  }

  public update() {
    super.update();
    this.checkFire();
  }

  public setBullets(bullets: Phaser.Physics.Arcade.Group) {
    this.bullets = bullets;
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
    const bullet = this.bullets.getFirstDead(true, this.x, this.y - 64);
    if (bullet) {
      const bulletVelocity = this.body.velocity.x > 0 ? this.FIRE_SPEED : -this.FIRE_SPEED;
      bullet.setVelocityX(bulletVelocity);
    }
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