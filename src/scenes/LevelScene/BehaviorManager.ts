import { LevelMap } from "~/src/entities/LevelMap";
import { LevelScene } from "./LevelScene";
import { EntityManager } from "./EntityManager";
import { Enemy } from "../../entities/enemies/Enemy";
import { LevelHud } from "./LevelHud";
import { Food } from "../../entities/generic/Food";
import { BRISTOL_SCALE_TIMER, BRISTOL_SCALE_TIMER_INCREASE } from "../../utils/Constants";
import { BlobBomb } from "../../entities/generic/BlobBomb";
import { PaperBomb } from "../../entities/generic/PaperBomb";
import { Bullet } from "../../entities/generic/Bullet";

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
    this.checkGameOver();
  }

  public createKeys() {
    this.cursorKeys = this.scene.input.keyboard.createCursorKeys();
  }

  public createBristolScaleTimer() {
    this.scene.time.addEvent({
      delay: BRISTOL_SCALE_TIMER,
      callback: () => {
        this.entityManager.getKid().increaseBristolScale(BRISTOL_SCALE_TIMER_INCREASE);
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
        if (this.entityManager.getKid().getBristolLevel() <= 50) {
          this.entityManager.getKid().poo();
        } else {
          this.entityManager.getKid().diarrea();
        }
      }
    }

    if (this.cursorKeys.shift.isDown) {
      if (this.entityManager.getKid().getBristolLevel() < 50)
        this.entityManager.getKid().fart();
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

    this.scene.physics.collide(this.entityManager.getKid().diarreaBullets, this.map.getSolidLayer(), (poo, layer) => {
      this.scene.time.delayedCall(2000, () => {
        poo.destroy();
      })
    })

    this.scene.physics.collide(this.entityManager.getBullets(), this.map.getSolidLayer(), (bullet, layer) => {
      if (bullet instanceof BlobBomb) {
        bullet.explode();
      }
      bullet.destroy();
    })

    this.scene.physics.collide(this.entityManager.getPaperBombs(), this.map.getSolidLayer(), (paper: PaperBomb, layer) => {
      paper.roll();
    })

    // 3. collisions between bullets and entities
    this.scene.physics.overlap(this.entityManager.getKid(), this.entityManager.getBullets(), (kid, bullet) => {
      if (bullet instanceof BlobBomb) {
        bullet.explode();
      }
      bullet.destroy();
      this.entityManager.getKid().takeDamage(1); // TODO: cambiar segun la bala que sea vieja
      this.scene.cameras.main.shake(100, 0.01);
    });

    this.scene.physics.collide(this.entityManager.getKid(), this.entityManager.getPaperBombs(), (kid, bomb) => {
      // bullet.destroy();
      this.entityManager.getKid().takeDamage(1); // TODO: cambiar segun la bala que sea vieja
      // this.entityManager.getKid().setVelocityX(-200); // TODO: cambiar segun la bala que sea vieja
      this.scene.cameras.main.shake(100, 0.01);


    })

    this.scene.physics.overlap(this.entityManager.getKid().pooBullets, this.entityManager.getEnemies(), (poo, enemy: Enemy) => {
      poo.destroy();
      enemy.hurt();
      if (enemy.isDead()) {
        enemy.destroy();
      }
    })

    this.scene.physics.overlap(this.entityManager.getKid().pooBullets, this.entityManager.getPaperBombs(), (poo, enemy: Enemy) => {
      poo.destroy();
      enemy.hurt();
      if (enemy.isDead()) {
        enemy.destroy();
      }
    })

    this.scene.physics.overlap(this.entityManager.getKid().pooBullets, this.entityManager.getBullets(), (poo, bullet: Bullet) => {
      poo.destroy();
      bullet.destroy();
    })

    this.scene.physics.overlap(this.entityManager.getKid().diarreaBullets, this.entityManager.getPaperBombs(), (poo, enemy: Enemy) => {
      poo.destroy();
      enemy.hurt();
      if (enemy.isDead()) {
        enemy.destroy();
      }
    })

    this.scene.physics.overlap(this.entityManager.getKid().diarreaBullets, this.entityManager.getEnemies(), (poo, enemy: Enemy) => {
      poo.destroy();
      enemy.hurt();
      if (enemy.isDead()) {
        enemy.destroy();
      }
    })

    // 4. collisions between kid and food
    this.scene.physics.overlap(this.entityManager.getKid(), this.entityManager.getFood(), (kid, food: Food) => {
      this.entityManager.getKid().eat(food);
    });



  }

  checkGameOver() {
    if (this.entityManager.getKid().isDead()) {
      this.scene.scene.stop("LevelHud");
      this.scene.scene.start("GameOverScene");
    }
  }

}