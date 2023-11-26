import { KID_JUMP_VELOCITY, KID_VELOCITY_X, POO_TIME, POO_VELOCITY } from "../utils/Constants";
import { PooBullet } from "./generic/PooBullet";

export class Kid extends Phaser.Physics.Arcade.Sprite {

  private pooing: boolean = false;
  private punching: boolean = false;
  private life: number = 10;

  public pooBullets!: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "kid");

    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.anims.createFromAseprite("kid");
    this.setOrigin(0.5, 1);

    this.body.setSize(64, 110)
    this.body.setOffset(32, 62);

    this.pooBullets = this.scene.physics.add.group({
      classType: PooBullet,
      max: 20,
      allowGravity: false
    });
  }

  // update method
  // --------------

  public update() {
    this.playAnimation();
  }

  // actions 
  // --------------

  public walk(direction: 'left' | 'right') {
    switch (direction) {
      case 'left':
        this.setFlipX(true);
        this.setVelocityX(-KID_VELOCITY_X);

        break;

      case 'right':
        this.setFlipX(false);
        this.setVelocityX(KID_VELOCITY_X);

        break;
      default:
        break;
    }

  }

  public jump() {
    if (this.body?.blocked.down) {
      this.setVelocityY(-KID_JUMP_VELOCITY);
    }
  }

  public poo() {
    if (this.pooing) {
      return;
    }

    this.pooing = true;
    const poo = this.pooBullets.getFirstDead(true);
    const pooOffsetX = this.flipX ? 32 : -32;
    poo.setPosition(this.x + pooOffsetX, this.y - 32);
    poo.setVelocityX(POO_VELOCITY * (this.flipX ? 1 : -1));

    if (!this.body?.blocked.down) {
      poo.setVelocityY(1000);
    }

    this.scene.time.delayedCall(POO_TIME, () => {
      this.pooing = false;
    })
  }

  public punch() {
    if (this.punching) {
      return;
    }
    this.punching = true;

    this.scene.time.addEvent({
      delay: 200,
      callback: () => {
        this.punching = false;
      }
    })
  }

  public takeDamage(amount?: number) {
    this.life -= amount || 1;
  }

  public isDead() {
    return this.life <= 0;
  }

  public stopMovement() {
    this.setVelocityX(0);
  }

  // animations 
  // --------------

  private playPooAnimation() {
    this.anims.play({
      key: "poo",
      frameRate: 20
    }, true);
  }

  private playPunchAnimation() {
    this.anims.play({
      key: "punch",
      frameRate: 20
    }, true);
  }

  private playJumpAnimation() {
    this.anims.play({
      key: "jump",
      frameRate: 20
    }, true);
  }

  private playFallAnimation() {
    this.anims.play({
      key: "fall",
      frameRate: 30
    }, true);
  }

  private playWalkAnimation() {
    this.anims.play({
      key: "walk",
      frameRate: 20
    }, true);
  }

  private playIdleAnimation() {
    this.anims.play("idle", true);
  }

  private playAnimation() {
    if (!this.body) return;

    if (this.pooing) {
      this.playPooAnimation();
      return;
    }

    if (this.punching) {
      this.playPunchAnimation();
      return;
    }

    if (this.body.blocked.down) {
      if (this.body.velocity.x !== 0) {
        this.playWalkAnimation();
        return;
      } else {
        this.playIdleAnimation();
        return;
      }
    } else {
      if (this.body.velocity.y < 0) {
        this.playJumpAnimation();
        return;
      } else {
        this.playFallAnimation();
        return;
      }
    }
  }





}