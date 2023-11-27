export class Tree extends Phaser.GameObjects.Sprite {

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "tree");

    this.scene.add.existing(this);
    this.anims.createFromAseprite("tree");
    this.setOrigin(0.5, 1);
    this.setDepth(10);
    this.anims.play({
      key: "idle",
      frameRate: 1,
      repeat: -1
    }, true)
  }
}