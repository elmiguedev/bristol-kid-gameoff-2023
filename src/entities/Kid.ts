import { KID_JUMP_VELOCITY, KID_VELOCITY_X } from "../utils/Constants";

export class Kid extends Phaser.Physics.Arcade.Sprite {

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "kid");

    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.anims.createFromAseprite("kid");
    this.setOrigin(0.5, 1);
  }

  public walk(direction: 'left' | 'right') {
    switch (direction) {
      case 'left':
        this.setFlipX(true);
        this.setVelocityX(-KID_VELOCITY_X);
        this.anims.play("walk", true);
        break;

      case 'right':
        this.setFlipX(false);
        this.setVelocityX(KID_VELOCITY_X);
        this.anims.play("walk", true);
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

  public stopMovement() {
    this.setVelocityX(0);
    this.setFrame(0);
  }


}