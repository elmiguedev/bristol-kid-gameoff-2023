import { GameObjects, Scene } from "phaser";

export enum LevelKey {
  LEVEL_1 = "level_1",
  LEVEL_2 = "level_2",
  LEVEL_3 = "level_3",
}

export class LevelMap {

  private scene: Scene;
  private currentLevel: LevelKey;

  private map!: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset | null;
  private tilesLayer: Phaser.Tilemaps.TilemapLayer | null;
  private solidLayer: Phaser.Tilemaps.TilemapLayer | null;
  private objectsLayer: Phaser.Tilemaps.ObjectLayer | null;

  constructor(scene: Scene, currentLevel: LevelKey) {
    this.scene = scene;
    this.currentLevel = currentLevel;

    this.map = this.scene.make.tilemap({ key: "levels" });
    this.tileset = this.map.addTilesetImage("tileset", "tileset")!;

    this.objectsLayer = this.map.getObjectLayer(`${this.currentLevel}/objects_layer`);
    this.tilesLayer = this.map.createLayer(`${this.currentLevel}/tiles_layer`, `tileset`, 0, 0);
    this.solidLayer = this.map.createLayer(`${this.currentLevel}/solid_layer`, `tileset`, 0, 0);
    if (this.solidLayer) {
      this.solidLayer.forEachTile((tile) => {
        if (tile.properties.solid) {
          if (!tile.properties.solid_left && !tile.properties.solid_right && !tile.properties.solid_top && !tile.properties.solid_bottom) {
            tile.setCollision(true, true, true, true);
          } else {
            tile.setCollision(
              tile.properties.solid_left || false,
              tile.properties.solid_right || false,
              tile.properties.solid_top || false,
              tile.properties.solid_bottom || false
            );
          }
        }
      })

      this.solidLayer.setVisible(false);
    }
  }

  public addCollider(object: GameObjects.GameObject) {
    if (this.solidLayer)
      this.scene.physics.add.collider(this.solidLayer, object);
  }

  public getKidPosition() {
    if (this.objectsLayer) {
      return this.objectsLayer.objects.find((object: any) => object.name === "kid")!;
    }
  }


}