import { Kid } from "../../entities/Kid";
import { LevelMap } from "../../entities/LevelMap";
import { EnemySoldier } from "../../entities/enemies/Soldier";
import Bullet from "../../entities/generic/Bullet";
import { LevelScene } from "./LevelScene";

export class EntityManager {

  private scene: LevelScene;
  private map: LevelMap;

  private kid!: Kid;
  private enemies!: Phaser.Physics.Arcade.Group;
  private bullets!: Phaser.Physics.Arcade.Group;

  constructor(scene: LevelScene, map: LevelMap) {
    this.scene = scene;
    this.map = map;
  }

  public update() {
    this.kid.update();
  }

  public createKid() {
    const position = this.map.getKidPosition();
    this.kid = new Kid(
      this.scene,
      position.x || 100,
      position.y || 100
    );
  }

  public createEnemies() {
    this.bullets = this.scene.physics.add.group({
      maxSize: 100,
      classType: Bullet,
      allowGravity: false
    })
    this.enemies = this.scene.physics.add.group({
      runChildUpdate: true
    });
    this.map.getObjects().forEach((object) => {
      this.createEnemy(object);
    });
  }

  public getKid() {
    return this.kid;
  }

  public getEnemies() {
    return this.enemies;
  }

  public getBullets() {
    return this.bullets;
  }

  private createEnemy(object: Phaser.Types.Tilemaps.TiledObject) {
    switch (object.type) {
      case "enemy_soldier":
        const enemySoldier = new EnemySoldier(this.scene, object.x, object.y);
        enemySoldier.setBullets(this.bullets);
        enemySoldier.setTarget(this.kid);
        this.enemies.add(enemySoldier);
        break;
    }
  }
}