import { Kid } from "../../Kid";
import { Enemy } from "../Enemy";

export class TankOMatic extends Enemy {

  private tackleTimer: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "tank_o_matic");
    this.life = 30
    this.configureHitbox();
    this.playIdleAnimation();
    this.scene.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => {
        this.tackleAttack();
      }
    })
  }

  private configureHitbox() {
    this.setMass(10000)
    this.setImmovable(true);
    this.setPushable(false);
    this.body.setSize(256, 300);
    this.body.setOffset(128, 64)
  }

  private playIdleAnimation() {
    this.anims.play({
      key: "idle",
      frameRate: 10,
      repeat: -1
    }, true)
  }

  public tackleAttack() {
    this.shake(() => {
      this.tackle()
    })
  }

  private shake(onComplete) {
    this.scene.tweens.add({
      targets: this,
      duration: 50,
      x: this.x + 10,
      y: this.y + 10,
      yoyo: true,
      repeat: 12,
      onComplete: onComplete
    })
  }

  private tackle() {
    this.setVelocityX(-1000)
    this.tackleTimer = this.scene.time.delayedCall(300, () => {
      this.resetPosition();
    })
  }

  private resetTackleTimer() {
    if (this.tackleTimer) {
      this.tackleTimer.reset({
        delay: 300,
        callback: () => {
          this.resetPosition();
        }
      });
    }
  }

  private resetPosition() {
    this.setVelocityX(0)
    this.scene.tweens.add({
      targets: this,
      duration: 300,
      x: this.initialPosition.x,
    })
  }

  public setTarget(kid: Kid) {
    super.setTarget(kid);
    this.scene.physics.add.collider(this, kid, () => {
      console.log("overlap")
      this.resetPosition();
      this.resetTackleTimer();
      this.scene.cameras.main.shake(100, 0.01);
      // this.scene.tweens.add({
      //   targets: kid,
      //   x: {
      //     from: kid.x,
      //     to: kid.x - 200
      //   },
      //   duration: 100
      // })
    });
  }

}