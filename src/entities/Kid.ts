export class Kid extends Phaser.Physics.Arcade.Sprite {

  private isJumping: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "kid");

    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.anims.createFromAseprite("kid");
    this.setDrag(200);
    this.setOrigin(0.5, 1);
  }

  public update() {
    if (this.body!.blocked.down) {
      this.isJumping = false;
    }
  }

  public walk(direction: 'left' | 'right') {
    switch (direction) {
      case 'left':
        this.setFlipX(true);
        this.setVelocityX(-400);
        this.anims.play("walk", true);
        break;

      case 'right':
        this.setFlipX(false);
        this.setVelocityX(400);
        this.anims.play("walk", true);
        break;
      default:
        break;
    }

  }

  public jump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.setVelocityY(-700);
    }
  }

  public idle() {
    this.setFrame(0);
  }


}