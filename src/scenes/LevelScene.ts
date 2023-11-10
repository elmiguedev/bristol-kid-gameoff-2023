import { Kid } from "../entities/Kid";
import { LevelKey, LevelMap } from "../entities/LevelMap";

export class LevelScene extends Phaser.Scene {

  private currentLevel!: LevelKey;
  private levelMap!: LevelMap;
  private kid!: Kid;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("LevelScene");
  }

  // Creation methods
  // --------------------------
  init(params: any) {
    this.currentLevel = params.level || LevelKey.LEVEL_1;
  }


  create() {
    this.createMap();
    this.createKid();
    this.createCursors();
    this.createCollisions();
  }

  createMap() {
    this.levelMap = new LevelMap(this, this.currentLevel);
  }

  createKid() {
    this.kid = new Kid(this, 640, 640);
    this.cameras.main.startFollow(this.kid, true);
    const kidPosition = this.levelMap.getKidPosition();
    if (kidPosition) {
      this.kid.setPosition(kidPosition.x, kidPosition.y);
    }
  }

  createCursors() {
    this.cursors = this.input.keyboard!.createCursorKeys();
  }


  createCollisions() {
    this.levelMap.addCollider(this.kid);
  }

  // behavior methods
  // --------------------------

  update() {
    this.checkInput();
  }

  checkInput() {

    if (this.cursors.right.isDown) {
      this.kid.walk("right");
    } else if (this.cursors.left.isDown) {
      this.kid.walk("left");
    } else {
      this.kid.stopMovement();
    }

    if (this.cursors.up.isDown) {
      this.kid.jump();
    }

    if (this.cursors.shift.isDown) {
      this.scene.restart({ level: "level_2" });
    }

  }

}