import { LevelMap } from "~/src/entities/LevelMap";
import { LevelScene } from "./LevelScene";
import { EntityManager } from "./EntityManager";
import { Enemy } from "../../entities/enemies/Enemy";
import { LevelHud } from "./LevelHud";
import { Food } from "../../entities/generic/Food";
import { BRISTOL_SCALE_TIMER, BRISTOL_SCALE_TIMER_INCREASE } from "../../utils/Constants";

export class BehaviorManager {
  private scene: LevelScene;
  private map: LevelMap;
  private entityManager: EntityManager;
  private hud: LevelHud;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;


  constructor(scene: LevelScene, map: LevelMap, entityManager: EntityManager, hud: LevelHud) {
    this.scene = scene;
    this.map = map;
    this.entityManager = entityManager;
    this.hud = hud;
  }

  public update() {
    this.checkCollisions();
    this.checkKeys();
  }

  public createKeys() {
    this.cursorKeys = this.scene.input.keyboard.createCursorKeys();
  }

  public createBristolScaleTimer() {
    this.scene.time.addEvent({
      delay: BRISTOL_SCALE_TIMER,
      callback: () => {
        this.entityManager.getKid().increaseBristolScale(BRISTOL_SCALE_TIMER_INCREASE);
        this.hud.setBristolLevel(this.entityManager.getKid().getBristolLevel());
      },
      loop: true
    })
  }

  public checkKeys() {
    if (this.cursorKeys.right.isDown) {
      this.entityManager.getKid().walk("right");
    } else if (this.cursorKeys.left.isDown) {
      if (!this.entityManager.getKid().isPooing())
        this.entityManager.getKid().walk("left");
    } else {
      this.entityManager.getKid().stopMovement();
    }

    if (this.cursorKeys.up.isDown) {
      this.entityManager.getKid().jump();
    }

    if (this.cursorKeys.down.isDown) {
      this.entityManager.getKid().stepDown();
    }

    if (this.cursorKeys.space.isDown) {
      if (this.entityManager.getKid().canPoo()) {
        this.hud.decreasePooLevel();
        this.entityManager.getKid().poo();
      }
    }
  }

  public checkCollisions() {

    // 1. collisions between entities and solid tiles
    this.scene.physics.collide(this.entityManager.getKid(), this.map.getSolidBaseLayer())

    if (!this.entityManager.getKid().isStepDown()) {
      this.scene.physics.collide(this.entityManager.getKid(), this.map.getSolidLayer())
    }

    this.scene.physics.collide(this.entityManager.getEnemies(), this.map.getSolidLayer())

    // 2. collisions between entities bullets and solid tiles
    this.scene.physics.collide(this.entityManager.getKid().pooBullets, this.map.getSolidLayer(), (poo, layer) => {
      poo.destroy();
    })

    this.scene.physics.collide(this.entityManager.getBullets(), this.map.getSolidLayer(), (bullet, layer) => {
      bullet.destroy();
    })

    // 3. collisions between bullets and entities
    this.scene.physics.overlap(this.entityManager.getKid(), this.entityManager.getBullets(), (kid, bullet) => {
      bullet.destroy();
      this.entityManager.getKid().takeDamage(1);
      this.scene.cameras.main.shake(100, 0.01);
      if (this.entityManager.getKid().isDead()) {
        this.scene.scene.start("GameOverScene");
      }
    })

    this.scene.physics.overlap(this.entityManager.getKid().pooBullets, this.entityManager.getEnemies(), (poo, enemy: Enemy) => {
      poo.destroy();
      enemy.hurt();
      if (enemy.isDead()) {
        enemy.destroy();
      }
    })

    // 4. collisions between kid and food
    this.scene.physics.overlap(this.entityManager.getKid(), this.entityManager.getFood(), (kid, food: Food) => {
      const foodValue = food.getFoodValue();
      const foodBristolValue = food.getBristolValue();
      food.destroy();
      this.entityManager.getKid().increasePooLevel(foodValue);
      this.entityManager.getKid().increaseBristolScale(foodBristolValue);
      this.hud.increasePooLevel(foodValue);
      this.hud.setBristolLevel(this.entityManager.getKid().getBristolLevel());
    });



  }

}