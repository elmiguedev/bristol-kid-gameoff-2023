export enum FoodType {
  APPLE = "apple",
  BURGER = "burger",
  APIO = "apio",
  CHEESE = "cheese",
  CARBON = "carbon",
  PILL = "pill",
}

export const FOOD_VALUE = {
  [FoodType.APPLE]: 5,
  [FoodType.BURGER]: 15,
  [FoodType.APIO]: 3,
  [FoodType.CHEESE]: 7,
  [FoodType.CARBON]: 0,
  [FoodType.PILL]: 0
}

export const FOOD_BRISTOL_VALUE = {
  [FoodType.APPLE]: 5,
  [FoodType.BURGER]: 10,
  [FoodType.APIO]: 1,
  [FoodType.CHEESE]: -10,
  [FoodType.CARBON]: -30,
  [FoodType.PILL]: -50
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

  public getBristolValue() {
    return FOOD_BRISTOL_VALUE[this.foodType];
  }


}