export class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setBounce(1, 0);
        this.setGravityY(0);
        this.anims.createFromAseprite(texture);
        this.anims.play({
            key: "idle",
            frameRate: 20,
            repeat: -1
        }, true)
    }
}