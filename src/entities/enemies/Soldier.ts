import { Scene } from "phaser";

export class EnemySoldier extends Phaser.Physics.Arcade.Sprite {
    constructor(scene:Scene, x:number, y:number) {
        super(scene, x, y, "enemy_soldier");
        this.setOrigin(0.5, 1);
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.anims.createFromAseprite("enemy_soldier");
        this.anims.play({
            key: "walk",
            frameRate: 10,
            repeat: -1
        }, true);
    }
}