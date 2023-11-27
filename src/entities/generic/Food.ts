export enum FoodType {
  APPLE = "apple",
  BURGER = "burger",
}

export const FOOD_VALUE = {
  [FoodType.APPLE]: 4,
  [FoodType.BURGER]: 10,
}

export class Food extends Phaser.Physics.Arcade.Sprite {
  private foodType: FoodType;
  constructor(scene: Phaser.Scene, x: number, y: number, foodType: FoodType) {
    super(scene, x, y, "food");
    this.anims.createFromAseprite("food");
    this.foodType = foodType;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.playAnim()
  }

  private playAnim() {
    this.play({
      key: this.foodType,
      frameRate: 10,
      repeat: -1
    }, true)
  }

  public getFoodValue() {
    return FOOD_VALUE[this.foodType];
  }


}