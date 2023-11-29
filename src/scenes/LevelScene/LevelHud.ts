import { Kid } from "../../entities/Kid";
import { BristolScale } from "../../entities/hud/BristolScale";
import { MAX_FART_LEVEL, MAX_KID_LIFE, MAX_POO_LEVEL } from "../../utils/Constants";

export class LevelHud extends Phaser.Scene {

  private pooLevelSprite: Phaser.GameObjects.Sprite;
  private fartLevelSprite: Phaser.GameObjects.Sprite;
  private lifeLevelSprite: Phaser.GameObjects.Sprite;
  private bristolScale: BristolScale;
  private kid: Kid;

  constructor() {
    super('LevelHud');
  }

  create() {
    this.createPooLevel();
    this.createBristolScale();
    this.createFartLevel();
    this.createLifeLevel();
  }

  update() {
    this.checkFartLevel();
    this.checkPooLevel();
    this.checkBristolLevel();
    this.checkLifeLevel();
  }

  public setKid(kid: Kid) {
    this.kid = kid;
  }

  private createBristolScale() {
    this.bristolScale = new BristolScale(
      this,
      20,
      20
    );
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

  private createFartLevel() {
    this.fartLevelSprite = this.add.sprite(
      1280,
      100,
      "fart_level",
    );
    this.fartLevelSprite.setOrigin(1, 0);
    this.fartLevelSprite.anims.createFromAseprite("fart_level");
    this.fartLevelSprite.anims.play({
      key: "idle",
      frameRate: 10,
      repeat: -1
    }, true)
  }

  private createLifeLevel() {
    this.lifeLevelSprite = this.add.sprite(
      30,
      120,
      "life_level",
    );
    this.lifeLevelSprite.setOrigin(0, 0);
    this.lifeLevelSprite.anims.createFromAseprite("life_level");
    this.lifeLevelSprite.anims.play({
      key: "idle",
      frameRate: 10,
      repeat: -1
    }, true)
  }

  private checkFartLevel() {
    if (!this.kid) return;
    const fartLevelUnit = this.fartLevelSprite.width / MAX_FART_LEVEL;
    const offset = fartLevelUnit * this.kid.getFartLevel();
    this.fartLevelSprite.x = 1280 + this.fartLevelSprite.width - offset;
  }

  private checkPooLevel() {
    if (!this.kid) return;
    const pooLevelUnit = this.pooLevelSprite.width / MAX_POO_LEVEL;
    const offset = pooLevelUnit * this.kid.getPooLevel();
    this.pooLevelSprite.x = 1280 + this.pooLevelSprite.width - offset;
  }

  private checkLifeLevel() {
    if (!this.kid) return;
    const lifeLevelUnit = this.lifeLevelSprite.width / MAX_KID_LIFE;
    const offset = lifeLevelUnit * this.kid.getLife();
    // this.lifeLevelSprite.x = -this.lifeLevelSprite.width + offset;
    this.lifeLevelSprite.setDisplaySize(offset, this.lifeLevelSprite.height);
  }

  private checkBristolLevel() {
    if (!this.kid) return;
    this.bristolScale.setLevel(this.kid.getBristolLevel());
  }



}