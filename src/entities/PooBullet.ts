import { POO_VELOCITY } from "../utils/Constants";

export class PooBullet extends Phaser.Physics.Arcade.Sprite{
    constructor(scene:Phaser.Scene, x:number, y:number) {
        super(scene, x, y, "poo_bullet");
        this.setOrigin(0.5, 1);
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setBounce(1, 0);
        this.setGravityY(0);
    }
}