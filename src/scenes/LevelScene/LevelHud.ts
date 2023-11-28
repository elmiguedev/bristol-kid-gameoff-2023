import { BristolScale } from "../../entities/hud/BristolScale";
import { MAX_POO_LEVEL } from "../../utils/Constants";

export class LevelHud extends Phaser.Scene {

  private pooLevelSprite: Phaser.GameObjects.Sprite;
  private bristolScale: BristolScale;
  private txt: Phaser.GameObjects.Text;

  constructor() {
    super('LevelHud');
  }

  create() {
    this.createPooLevel();
    this.createBristolScale();
    this.txt = this.add.text(20, 20, "ss");
  }

  private createPooLevel() {
    this.pooLevelSprite = this.add.sprite(
      1280,
      20,
      "poo_level",
    );
    this.pooLevelSprite.setOrigin(1, 0);
    this.pooLevelSprite.anims.createFromAseprite("poo_level");
    this.pooLevelSprite.anims.play({
      key: "idle",
      frameRate: 10,
      repeat: -1
    }, true)
  }

  public decreasePooLevel(value: number = 1) {
    const pooLevelUnit = this.pooLevelSprite.width / MAX_POO_LEVEL;
    const offset = pooLevelUnit * value;
    this.pooLevelSprite.x += offset;
    if (this.pooLevelSprite.x >= 1280 + this.pooLevelSprite.width) {
      this.pooLevelSprite.x = 1280 + this.pooLevelSprite.width;
    }
  }

  public increasePooLevel(value: number = 1) {
    const pooLevelUnit = this.pooLevelSprite.width / MAX_POO_LEVEL;
    const offset = pooLevelUnit * value;
    this.pooLevelSprite.x -= offset;
    if (this.pooLevelSprite.x <= 1280) {
      this.pooLevelSprite.x = 1280;
    }

  }

  public setBristolLevel(level: number) {
    this.bristolScale.setLevel(level);
  }

  private createBristolScale() {
    this.bristolScale = new BristolScale(
      this,
      20,
      20
    );
  }



}