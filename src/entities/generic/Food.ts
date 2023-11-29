export enum FoodType {
  APPLE = "apple",
  BURGER = "burger",
  APIO = "apio",
  CHEESE = "cheese",
  CARBON = "carbon",
  PILL = "pill",
}

export const FOOD_VALUES = {
  [FoodType.APPLE]: {
    poo: 5,
    fart: 5,
    bristol: 5
  },
  [FoodType.BURGER]: {
    poo: 15,
    fart: 40,
    bristol: 10
  },
  [FoodType.APIO]: {
    poo: 3,
    fart: 0,
    bristol: 1
  },
  [FoodType.CHEESE]: {
    poo: 7,
    fart: 30,
    bristol: -10
  },
  [FoodType.CARBON]: {
    poo: 0,
    fart: 20,
    bristol: -30
  },
  [FoodType.PILL]: {
    poo: 0,
    fart: 0,
    bristol: -50
  }
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

  public getPooValue() {
    return FOOD_VALUES[this.foodType].poo;
  }

  public getBristolValue() {
    return FOOD_VALUES[this.foodType].bristol;
  }

  public getFartValue() {
    return FOOD_VALUES[this.foodType].fart;
  }


}