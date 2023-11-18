export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene:Phaser.Scene, x:number, y:number) {
        super(scene, x, y, "bullet");
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
    }

    destroy() {
        super.destroy(true);
        this.setActive(false).setVisible(false)
    }
}