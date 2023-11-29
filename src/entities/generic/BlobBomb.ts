import { BlobBullet } from "./BlobBullet";

export class BlobBomb extends BlobBullet {
  private miniBombCount = 10;
  private bullets!: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, x: number, y: number, bullets: Phaser.Physics.Arcade.Group) {
    super(scene, x, y);
    this.bullets = bullets;
    this.setScale(1);
  }

  public explode() {
    for (let i = 0; i < this.miniBombCount; i++) {
      this.createMiniBomb();
    }
  }

  private createMiniBomb() {
    const bomb = new BlobBullet(this.scene, this.x, this.y);
    bomb.setScale(0.6);
    this.bullets.add(bomb);
    bomb.setPosition(this.x, this.y);
    const randomVelocityX = Phaser.Math.Between(-500, 500);
    const randomVelocityY = Phaser.Math.Between(-500, -10);
    bomb.setVelocity(randomVelocityX, randomVelocityY);
    // @ts-ignore
    bomb.body.allowGravity = true;
  }
}