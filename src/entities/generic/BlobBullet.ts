export class BlobBullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "blob_bullet");
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.anims.createFromAseprite("blob_bullet");
    this.anims.play({
      key: "idle",
      frameRate: 10,
      repeat: -1
    }, true)
  }
}