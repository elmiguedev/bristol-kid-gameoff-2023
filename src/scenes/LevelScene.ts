import { Kid } from "../entities/Kid";
import { LevelKey, LevelMap } from "../entities/LevelMap";
import { EnemySoldier } from "../entities/enemies/Soldier";

export class LevelScene extends Phaser.Scene {

  private currentLevel!: LevelKey;
  private levelMap!: LevelMap;
  private kid!: Kid;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private enemies!:Phaser.Physics.Arcade.Group;

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
    this.createEnemies();
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

  createEnemies() {
    this.enemies = this.physics.add.group();
    const positions = this.levelMap.getEnemiesPositions("soldier");
    if (positions) {
      positions.forEach((position) => {
        const enemy_soldier = new EnemySoldier(this,position.x!, position.y!);
        this.levelMap.addCollider(enemy_soldier);
        this.enemies.add(enemy_soldier);
        enemy_soldier.setVelocityX(-100);
      })
    }
  }

  createCursors() {
    this.cursors = this.input.keyboard!.createCursorKeys();
  }


  createCollisions() {
    this.levelMap.addCollider(this.kid);
    this.physics.add.collider(this.kid.pooBullets, this.enemies, (pooBullet, enemy) => {
      enemy.destroy();
      pooBullet.destroy();
    });
  }

  // behavior methods
  // --------------------------

  update() {
    this.checkInput();
    this.kid.update();
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

    if (this.cursors.space.isDown) {
    this.kid.poo();
    }

  }

}