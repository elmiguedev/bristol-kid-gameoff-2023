import { Kid } from "../../Kid";
import { BlobBullet } from "../../generic/BlobBullet";
import { Towel } from "../../generic/Towel";
import { Enemy } from "../Enemy";

export class TankOMatic extends Enemy {

  private isFiring: boolean = false;
  private isShaking: boolean = false;
  private fireCountdown: number = 50;
  private tackleTimer: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "tank_o_matic");
    this.life = 30
    this.targetRadius = 320;
    this.configureHitbox();
    this.playIdleAnimation();
    this.scene.time.addEvent({
      startAt: 1000,
      delay: 5500,
      loop: true,
      callback: () => {
        switch (Phaser.Math.Between(1, 3)) {
          case 1: this.tackleAttack(); break;
          case 2: this.fireAttack(); break;
          case 3: this.towelAttack(); break;
        }
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

  private playFireAnimation() {
    this.anims.play({
      key: "fire",
      frameRate: 10,
      repeat: -1
    }, true)
  }

  private playChargeAnimation() {
    this.anims.play({
      key: "charging",
      frameRate: 12,
      repeat: -1
    }, true)
  }

  private playDoorAnimation() {
    this.anims.play({
      key: "door",
      frameRate: 12,
    }, true)
  }

  private playCameraAnimation() {
    this.anims.play({
      key: "camera",
      frameRate: 10,
      repeat: -1
    }, true)
  }

  // attacks
  // ------------------------ 

  public tackleAttack() {
    this.shake(2000, () => {
      this.tackle()
    })
  }

  public fireAttack() {
    this.charging(() => {
      this.shake();
      const timer = this.scene.time.addEvent({
        delay: 2,
        loop: true,
        callback: () => {
          this.fire()
        }
      });
      this.scene.time.delayedCall(1500, () => {
        timer.destroy();
        this.playIdleAnimation();
      })
    })

  }

  public towelAttack() {
    this.cameraDetect(() => {
      this.playDoorAnimation();
      this.shake();
      this.throwTowels();
    })
  }

  // private methods
  // ------------------------ 

  private throwTowels() {
    this.scene.time.addEvent({
      delay: 400,
      repeat: 7,
      callback: () => {
        this.createTowel();
      },
    });
    this.scene.time.delayedCall(4000, () => {
      this.playIdleAnimation();
    })
  }

  private createTowel() {
    const towelX = this.x - 120;
    const towelY = this.y - 160;
    const towel = new Towel(this.scene, towelX, towelY);
    this.bullets.add(towel);
    // @ts-ignore
    towel.body.allowGravity = true;
    towel.setDepth(this.depth - 1);
    const towelVelocityX = Phaser.Math.Between(-700, -900);
    const towelVelocityY = Phaser.Math.Between(0, -900);
    towel.setVelocity(
      towelVelocityX,
      towelVelocityY
    );
  }

  private fire() {
    if (!this.isFiring) {

      this.isFiring = true;
      this.createBullet();
      this.playFireAnimation();
      this.scene.time.delayedCall(this.fireCountdown, () => {
        this.isFiring = false;
      })
    }
  }

  private createBullet() {
    const bulletX = this.x;
    const bulletY = this.y - 330;
    const bullet = new BlobBullet(this.scene, bulletX, bulletY);
    bullet.setScale(0.7);
    this.bullets.add(bullet);
    // @ts-ignore
    bullet.body.allowGravity = true;
    const bulletVelocity = Phaser.Math.Between(-300, -1000);
    bullet.setVelocityX(bulletVelocity);
  }

  private shake(duration?: number, onComplete?: Function) {
    if (!this.isShaking) {
      this.isShaking = true;
      const position = {
        x: this.x,
        y: this.y
      }
      const tween = this.scene.tweens.add({
        targets: this,
        duration: 50,
        x: position.x + 10,
        y: position.y + 10,
        yoyo: true,
        repeat: -1
      })
      this.scene.time.delayedCall(duration || 3000, () => {
        tween.destroy();
        this.setPosition(position.x, position.y)
        this.isShaking = false;
        if (onComplete) {
          onComplete();
        }
      })
    }
  }

  private charging(onComplete) {
    this.playChargeAnimation()
    this.scene.time.delayedCall(3000, () => {
      onComplete()
    })
  }

  private cameraDetect(onComplete) {
    this.playCameraAnimation()
    this.scene.time.delayedCall(3000, () => {
      onComplete()
    })
  }

  private tackle() {
    this.setVelocityX(-1000)
    this.tackleTimer = this.scene.time.delayedCall(300, () => {
      this.resetPosition();
      this.playIdleAnimation();
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

  public hurt() {
    super.hurt();
    this.shake(200);
  }

  public setTarget(kid: Kid) {
    super.setTarget(kid);
    this.scene.physics.add.collider(this, kid, () => {
      this.resetPosition();
      this.resetTackleTimer();
      this.scene.cameras.main.shake(100, 0.01);
      kid.takeDamage(2);
    });
  }

}