import { Scene } from "phaser";
import Bullet from "../generic/Bullet";
import { Kid } from "../Kid";

export class EnemySoldier extends Phaser.Physics.Arcade.Sprite {
  private WALK_RADIUS = 64;
  private FIRE_RADIUS = 256;
  private DEFAULT_SPEED = 100;
  private FIRE_COUNTDOWN = 1000;

  private initialPosition: Phaser.Types.Math.Vector2Like;
  private speed: number;
  private isFiring: boolean = false;
  private target: Kid;

  public bullets: Phaser.Physics.Arcade.Group;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "enemy_soldier");
    this.initialPosition = { x, y };
    this.speed = this.DEFAULT_SPEED;
    this.setOrigin(0.5, 1);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.anims.createFromAseprite("enemy_soldier");

  }

  public update() {
    this.checkPatrol();
  }

  public setTarget(target: Kid) {
    this.target = target;
  }

  public setBullets(bullets: Phaser.Physics.Arcade.Group) {
    this.bullets = bullets;
  }

  private checkPatrol() {
    if (!this.isFiring) {
      if (this.target && this.isInRange(this.target)) {
        this.fire();
      }

      if (this.x <= this.initialPosition.x! - this.WALK_RADIUS) {
        this.walk('right');
      } else if (this.x >= this.initialPosition.x! + this.WALK_RADIUS) {
        this.walk("left");
      }
    }
  }

  private isInRange(entity: Phaser.Types.Math.Vector2Like) {
    if (this.x > entity.x! - this.FIRE_RADIUS && this.x < entity.x! + this.FIRE_RADIUS) {
      return true;
    }
    return false;
  }

  private fire() {
    this.isFiring = true;
    this.setVelocityX(0);
    this.anims.play("fire", true);
    this.createBullet();
    this.scene.time.addEvent({
      delay: this.FIRE_COUNTDOWN,
      callback: () => {
        this.isFiring = false;
        this.walk(this.initialPosition.x! > this.x ? 'right' : 'left');
      }
    });
  }

  private createBullet() {
    const bullet = this.bullets.getFirstDead(true, this.x, this.y - 64);
    if (bullet) {
      bullet.setVelocityX(this.initialPosition.x! > this.x ? 400 : -400);
    }
  }

  private walk(direction: 'left' | 'right') {
    this.setFlipX(direction === 'left' ? false : true);
    this.setVelocityX(direction === 'left' ? -this.speed : this.speed);
    this.anims.play({
      key: "walk",
      frameRate: 10,
      repeat: -1
    }, true);
  }
}