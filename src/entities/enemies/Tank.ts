import { Enemy } from "./Enemy";

export class Tank extends Enemy {

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "enemy_tank");
    this.life = 20;
    this.anims.play({
      key: "with_canon",
      frameRate: 10,
      repeat: -1
    }, true);
  }

  public update() {
    super.update();

  }

}