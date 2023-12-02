import { Scene } from "phaser";
import { Kid } from "../Kid";
import { ENEMY_DEFAULT_TARGET_RADIUS } from "../../utils/Constants";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  protected initialPosition: Phaser.Types.Math.Vector2Like;
  protected target: Kid;
  protected targetRadius: number;
  protected life: number = 1;
  protected patrolRadius: number = 128;
  protected patrolSpeed: number = 50;
  protected patrolEnabled: boolean = false;

  public bullets: Phaser.Physics.Arcade.Group;

  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.initialPosition = { x, y };
    this.setOrigin(0.5, 1);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.anims.createFromAseprite(texture);
    this.targetRadius = ENEMY_DEFAULT_TARGET_RADIUS;
  }

  public setTarget(target: Kid) {
    this.target = target;
  }

  public hurt(amount?: number) {
    this.life -= amount || 1;
  }

  public isDead() {
    return this.life <= 0;
  }

  protected isTargetVisible() {
    if (!this.target) return false;
    if (this.body.velocity.x >= 0) { // esto quiere decir que dispara a la derecha
      if (this.target.x > this.x && this.target.x < this.x + this.targetRadius) {
        return true;
      }
    } else {
      if (this.target.x < this.x && this.target.x > this.x - this.targetRadius) {
        return true;
      }
    }
    return false;
  }

  public destroy() {
    super.destroy(true);
    this.setActive(false).setVisible(false);
  }

  public update() {
    if (this.active) {
      this.checkPatrol();
    }
  }

  public patrol(radius?: number) {
    this.patrolEnabled = true;
    if (radius) this.patrolRadius = radius;
    this.move("left");
  }

  protected checkPatrol() {
    if (this.patrolEnabled) {
      if (this.x <= this.initialPosition.x - this.patrolRadius) {
        this.move('right');
      } else if (this.x >= this.initialPosition.x! + this.patrolRadius) {
        this.move("left");
      }
    }
  }

  protected move(direction: 'left' | 'right') {
    if (!this.active) return;
    this.setFlipX(direction === 'left' ? false : true);
    this.setVelocityX(direction === 'left' ? -this.patrolSpeed : this.patrolSpeed);
  }

  public setBullets(bullets: Phaser.Physics.Arcade.Group) {
    this.bullets = bullets;
  }

}