export class Cloud extends Phaser.Physics.Arcade.Sprite {

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "cloud");

    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.setGravityY(0);
    this.setVelocityX(100);
    this.anims.createFromAseprite("cloud");
    this.setOrigin(0.5, 1);
    this.setDepth(1);
    this.anims.play({
      key: "idle_1",
      frameRate: 10,
      repeat: -1
    }, true);
  }

  update() {
    super.update();
    if (this.x > this.scene.physics.world.bounds.width) {
      super.destroy();
      this.destroy();
    }
  }
}