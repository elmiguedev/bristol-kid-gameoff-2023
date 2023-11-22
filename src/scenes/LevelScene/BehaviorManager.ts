import { LevelMap } from "~/src/entities/LevelMap";
import { LevelScene } from "./LevelScene";
import { EntityManager } from "./EntityManager";

export class BehaviorManager {
  private scene: LevelScene;
  private map: LevelMap;
  private entityManager: EntityManager;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;


  constructor(scene: LevelScene, map: LevelMap, entityManager: EntityManager) {
    this.scene = scene;
    this.map = map;
    this.entityManager = entityManager;
  }

  public update() {
    this.checkCollisions();
    this.checkKeys();
  }

  public createKeys() {
    this.cursorKeys = this.scene.input.keyboard.createCursorKeys();
  }

  public checkKeys() {
    if (this.cursorKeys.right.isDown) {
      this.entityManager.getKid().walk("right");
    } else if (this.cursorKeys.left.isDown) {
      this.entityManager.getKid().walk("left");
    } else {
      this.entityManager.getKid().stopMovement();
    }

    if (this.cursorKeys.up.isDown) {
      this.entityManager.getKid().jump();
    }

    if (this.cursorKeys.space.isDown) {
      // this.entityManager.getKid().poo();
      this.entityManager.getKid().punch();
    }
  }

  public checkCollisions() {

    // 1. collisions between entities and solid tiles
    this.scene.physics.collide(this.entityManager.getKid(), this.map.getSolidLayer())
    this.scene.physics.collide(this.entityManager.getEnemies(), this.map.getSolidLayer())

    // 2. collisions between entities bullets and solid tiles
    this.scene.physics.collide(this.entityManager.getKid().pooBullets, this.map.getSolidLayer(), (poo, layer) => {
      poo.destroy();
    })

    this.scene.physics.collide(this.entityManager.getBullets(), this.map.getSolidLayer(), (bullet, layer) => {
      bullet.destroy();
    })

  }

}