import { Enemy } from "../enemies/Enemy";

export class PaperBomb extends Enemy {

  private durationTime: number = 4000;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "paper");
    this.configureHitbox();
    this.setScale(2);
    this.playAirAnimation();
  }

  public roll() {
    this.playRollAnimation();
    this.scene.time.delayedCall(this.durationTime, () => {
      this.destroy();
    })
  }

  private configureHitbox() {
    this.body.setSize(32, 32);
    this.body.setOffset(16, 32);
  }

  private playAirAnimation() {
    this.anims.play({
      key: "air",
      frameRate: 50,
      repeat: -1
    }, true)
  }

  private playRollAnimation() {
    this.anims.play({
      key: "roll",
      frameRate: 30,
      repeat: -1
    }, true)
  }
}