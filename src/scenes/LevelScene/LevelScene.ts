import { LevelKey, LevelMap } from "../../entities/LevelMap";
import { LevelHud } from "./LevelHud";
import { BehaviorManager } from "./BehaviorManager";
import { EntityManager } from "./EntityManager";

export class LevelScene extends Phaser.Scene {
  public entityManager!: EntityManager;
  public behaviorManager!: BehaviorManager;
  private levelMap!: LevelMap;
  private currentLevel!: LevelKey;
  private hud!: LevelHud;

  constructor() {
    super("LevelScene");
  }

  init(params: any) {
    this.currentLevel = params.level || LevelKey.LEVEL_1;
  }

  create() {
    this.createMap();
    this.createEntities();
    this.createHud();
    this.createBehaviors();
    this.configureCamera();
  }

  createMap() {
    this.levelMap = new LevelMap(this, this.currentLevel);
  }

  createEntities() {
    this.entityManager = new EntityManager(this, this.levelMap);
    this.entityManager.createKid()
    this.entityManager.createObjects();
    this.entityManager.createClouds();
  }

  createBehaviors() {
    this.behaviorManager = new BehaviorManager(this, this.levelMap, this.entityManager, this.hud);
    this.behaviorManager.createKeys();
    // this.behaviorManager.createBristolScaleTimer();
  }

  configureCamera() {
    this.cameras.main.setBounds(0, 0, 6400, 1280);
    this.cameras.main.startFollow(this.entityManager.getKid(), true);
    this.cameras.main.setBackgroundColor(0x7d99ff);
  }

  createHud() {
    this.scene.run("LevelHud");
    this.hud = this.scene.get("LevelHud") as LevelHud;
    this.hud.setKid(this.entityManager.getKid());
  }

  update() {
    this.behaviorManager.update();
    this.entityManager.update();
  }





}