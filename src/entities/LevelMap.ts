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
  private topLayer: Phaser.Tilemaps.TilemapLayer | null;
  private backgroundLayer: Phaser.Tilemaps.TilemapLayer | null;
  private solidLayer: Phaser.Tilemaps.TilemapLayer | null;
  private solidBaseLayer: Phaser.Tilemaps.TilemapLayer | null;
  private objectsLayer: Phaser.Tilemaps.ObjectLayer | null;

  constructor(scene: Scene, currentLevel: LevelKey) {
    this.scene = scene;
    this.currentLevel = currentLevel;
    this.createMapLayers();
    this.configureSolidLayer();
  }

  public getKidPosition(): Phaser.Types.Math.Vector2Like {
    if (this.objectsLayer) {
      const position = this.objectsLayer.objects.find((object: any) => object.name === "kid");
      return {
        x: position?.x || 100,
        y: position?.y || 100
      };
    }
    return {
      x: 100,
      y: 100
    }
  }

  public getObjects() {
    return this.objectsLayer.objects;
  }

  public getTileObject(id: number) {
    return this.tileset.getTileProperties(id);
  }

  public getSolidLayer() {
    return this.solidLayer;
  }

  public getSolidBaseLayer() {
    return this.solidBaseLayer;
  }

  private createMapLayers() {
    this.map = this.scene.make.tilemap({ key: "levels" });
    this.tileset = this.map.addTilesetImage("tileset", "tileset")!;
    this.objectsLayer = this.map.getObjectLayer(`${this.currentLevel}/objects_layer`);
    this.backgroundLayer = this.map.createLayer(`${this.currentLevel}/background_layer`, `tileset`, 0, 0);
    this.topLayer = this.map.createLayer(`${this.currentLevel}/top_layer`, `tileset`, 0, 0);
    this.solidLayer = this.map.createLayer(`${this.currentLevel}/solid_layer`, `tileset`, 0, 0);
    this.solidBaseLayer = this.map.createLayer(`${this.currentLevel}/solid_base_layer`, `tileset`, 0, 0);

    console.log(this.map.widthInPixels)

    this.scene.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  }

  private configureSolidLayer() {
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
    if (this.solidBaseLayer) {
      this.solidBaseLayer.setCollisionByProperty({
        solid: true
      });
      this.solidBaseLayer.setVisible(false);

    }
  }

  public getWidth() {
    return this.map.widthInPixels;
  }

  public getHeight() {
    return this.map.heightInPixels;
  }

}