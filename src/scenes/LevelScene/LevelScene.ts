import { Kid } from "../../entities/Kid";
import { LevelKey, LevelMap } from "../../entities/LevelMap";
import { EnemySoldier } from "../../entities/enemies/Soldier";
import Bullet from "../../entities/generic/Bullet";
import { BehaviorManager } from "./BehaviorManager";
import { EntityManager } from "./EntityManager";

export class LevelScene extends Phaser.Scene {
  public entityManager!: EntityManager;
  public behaviorManager!: BehaviorManager;
  private levelMap!: LevelMap;
  private currentLevel!: LevelKey;

  constructor() {
    super("LevelScene");
  }

  init(params: any) {
    this.currentLevel = params.level || LevelKey.LEVEL_1;
  }

  create() {
    this.createMap();
    this.createEntities();
    this.createBehaviors();
    this.configureCamera();
  }

  createMap() {
    this.levelMap = new LevelMap(this, this.currentLevel);
  }

  createEntities() {
    this.entityManager = new EntityManager(this, this.levelMap);
    this.entityManager.createKid()
    this.entityManager.createEnemies();
    this.entityManager.createEnemies();
  }

  createBehaviors() {
    this.behaviorManager = new BehaviorManager(this, this.levelMap, this.entityManager);
    this.behaviorManager.createKeys();
  }

  configureCamera() {
    this.cameras.main.setBounds(0, 0, 6400, 1280);
    this.cameras.main.startFollow(this.entityManager.getKid(), true);
    this.cameras.main.setBackgroundColor(0xd77bba)
  }

  update() {
    this.behaviorManager.update();
    this.entityManager.update();
  }





}