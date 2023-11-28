import { Scene } from "phaser";
import { MAX_BRISTOL_LEVEL } from "../../utils/Constants";

export class BristolScale {

  private scene: Scene;
  private kidFace: Phaser.GameObjects.Sprite;
  private container: Phaser.GameObjects.Sprite;
  private x: number;
  private y: number;

  constructor(scene: Scene, x: number, y: number) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.createContainer();
    this.createKidFace();
    this.setLevel(35);
  }

  public setLevel(level: number) {
    const minX = this.x + 20;
    const maxX = this.container.width - 60;
    const unit = (maxX - minX) / MAX_BRISTOL_LEVEL;
    const x = minX + unit * level;
    const y = this.y + 13;

    this.kidFace.setPosition(x, y);
    this.playKidAnimation(level);
  }

  private createContainer() {
    this.container = this.scene.add.sprite(
      this.x,
      this.y,
      "bristol_scale_container"
    );
    this.container.setOrigin(0);
    this.container.anims.createFromAseprite("bristol_scale_container");
    this.container.anims.play({
      key: "idle",
      frameRate: 10,
      repeat: -1
    }, true);
  }

  private createKidFace() {
    this.kidFace = this.scene.add.sprite(
      this.container.width - 60,
      this.y + 13,
      "bristol_scale"
    );
    this.kidFace.setOrigin(0);
    this.kidFace.anims.createFromAseprite("bristol_scale");
  }

  private playKidAnimation(level: number) {
    if (level <= 20) {
      this.kidFace.anims.play("1", true);
    } else if (level <= 50) {
      this.kidFace.anims.play("4", true);
    } else {
      this.kidFace.anims.play("7", true);
    }
  }


}