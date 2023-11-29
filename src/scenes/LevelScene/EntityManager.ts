import { Kid } from "../../entities/Kid";
import { LevelMap } from "../../entities/LevelMap";
import { Soldier } from "../../entities/enemies/Soldier";
import { Tank } from "../../entities/enemies/Tank";
import { Bullet } from "../../entities/generic/Bullet";
import { Cloud } from "../../entities/generic/Cloud";
import { Food } from "../../entities/generic/Food";
import { Tree } from "../../entities/generic/Tree";
import { LevelScene } from "./LevelScene";

export class EntityManager {

  private scene: LevelScene;
  private map: LevelMap;

  private kid!: Kid;
  private enemies!: Phaser.Physics.Arcade.Group;
  private bullets!: Phaser.Physics.Arcade.Group;
  private clouds!: Phaser.Physics.Arcade.Group;
  private food!: Phaser.Physics.Arcade.Group;

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

  public createObjects() {
    this.bullets = this.scene.physics.add.group({
      maxSize: 100,
      classType: Bullet,
      allowGravity: false
    })
    this.enemies = this.scene.physics.add.group({
      runChildUpdate: true,
    });
    this.food = this.scene.physics.add.group({
      classType: Food,
      allowGravity: false
    })
    this.map.getObjects().forEach((object) => {
      this.createEnemy(object);
      this.createObject(object);
      this.createFood(object);
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

  public getFood() {
    return this.food;
  }

  private createEnemy(object: Phaser.Types.Tilemaps.TiledObject) {
    switch (object.type) {
      case "enemy_soldier":
        const enemySoldier = new Soldier(this.scene, object.x, object.y);
        this.enemies.add(enemySoldier);
        enemySoldier.setBullets(this.bullets);
        enemySoldier.setTarget(this.kid);
        const walkRadius = object.properties.find(p => p.name === "walk_radius").value || 64;
        enemySoldier.patrol(walkRadius);
        break;
      case "enemy_tank":
        const tank = new Tank(this.scene, object.x, object.y);
        this.enemies.add(tank);
        tank.setBullets(this.bullets);
        tank.setTarget(this.kid);
        tank.patrol();
        break;
    }
  }

  private createObject(object: Phaser.Types.Tilemaps.TiledObject) {
    switch (object.type) {
      case "tree":
        const tree = new Tree(this.scene, object.x, object.y);
        break;
    }
  }

  private createFood(object: Phaser.Types.Tilemaps.TiledObject) {
    switch (object.type) {
      case "food":
        const foodType = this.map.getTileObject(object.gid)["foodType"]
        const food = new Food(this.scene, object.x, object.y, foodType);
        this.food.add(food);
        break;
    }
  }

  public createClouds() {
    this.clouds = this.scene.physics.add.group({
      maxSize: 100,
      classType: Cloud,
      allowGravity: false,
      velocityY: 0,
      velocityX: 100,
      runChildUpdate: true,
    })
    this.scene.time.addEvent({
      delay: 10000,
      callback: () => {
        const cloud = this.clouds.getFirstDead(true, 100, 100);
        cloud.setPosition(100, 800);
      },
      loop: true
    })
  }
}