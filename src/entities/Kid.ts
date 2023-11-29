import { GRAVITY, KID_JUMP_VELOCITY, KID_VELOCITY_X, MAX_BRISTOL_LEVEL, MAX_FART_LEVEL, MAX_KID_VELOCITY_X, MAX_POO_LEVEL, MIN_KID_VELOCITY_X, POO_TIME, POO_VELOCITY } from "../utils/Constants";
import { Diarrea } from "./generic/Diarrea";
import { Food } from "./generic/Food";
import { PooBullet } from "./generic/PooBullet";

export class Kid extends Phaser.Physics.Arcade.Sprite {

  private pooing: boolean = false;
  private farting: boolean = false;
  private punching: boolean = false;
  private life: number = 10;
  private isStepDownState: boolean = false;
  private pooLevel: number = MAX_POO_LEVEL;
  private bristolLevel: number = 35;
  private fartLevel: number = MAX_FART_LEVEL;

  public pooBullets!: Phaser.Physics.Arcade.Group;
  public diarreaBullets!: Phaser.Physics.Arcade.Group;

  public fartCloud!: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "kid");

    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);
    this.anims.createFromAseprite("kid");
    this.setOrigin(0.5, 1);
    this.setDepth(20);

    this.body.setSize(64, 110)
    this.body.setOffset(32, 62);
    this.setMaxVelocity(KID_VELOCITY_X, MAX_KID_VELOCITY_X);

    this.pooBullets = this.scene.physics.add.group({
      classType: PooBullet,
      max: 20,
      allowGravity: false
    });
    this.diarreaBullets = this.scene.physics.add.group({
      classType: Diarrea,
      max: 40,
      allowGravity: true,
      runChildUpdate: true
    });

  }

  // update method
  // --------------

  public update() {
    this.checkFartPosition();
    this.playAnimation();

    if (this.body.velocity.y > 0) {
      console.log(this.body.velocity.y)
    }
  }

  // actions 
  // --------------

  public walk(direction: 'left' | 'right') {
    switch (direction) {
      case 'left':
        this.setFlipX(true);
        this.setVelocityX(-this.getKidVelolity());

        break;

      case 'right':
        this.setFlipX(false);
        this.setVelocityX(this.getKidVelolity());

        break;
      default:
        break;
    }

  }

  public jump() {
    if (this.body?.blocked.down) {
      this.setVelocityY(-KID_JUMP_VELOCITY);
    }
  }

  public poo() {
    this.pooing = true;
    this.decreasePooLevel(2);
    const poo = this.pooBullets.getFirstDead(true);
    const pooOffsetX = this.flipX ? 32 : -32;
    poo.setPosition(this.x + pooOffsetX, this.y - 32);
    poo.setVelocityX(POO_VELOCITY * (this.flipX ? 1 : -1));

    if (!this.body?.blocked.down) {
      poo.setVelocityY(1000);
    }

    this.scene.time.delayedCall(POO_TIME, () => {
      this.pooing = false;
    })
  }

  public diarrea() {
    this.pooing = true;

    const poo = this.diarreaBullets.getFirstDead(true);
    const pooVelocityX = Phaser.Math.Between(50, 150);
    this.decreasePooLevel();

    const pooOffsetX = this.flipX ? 32 : -32;
    poo.setScale(0.5);
    poo.setAlpha(0.7);
    poo.setPosition(this.x + pooOffsetX, this.y - 32);
    poo.setVelocityX(pooVelocityX * (this.flipX ? 1 : -1));
    poo.setDragX(100);



    this.scene.time.delayedCall(20, () => {
      this.pooing = false;
    })
  }

  public fart() {
    if (this.fartLevel <= 0) {
      return;
    }

    this.farting = true;

    if (!this.fartCloud) {
      this.fartCloud = this.scene.physics.add.sprite(this.x, this.y - 32, "fart");
      // @ts-ignore
      this.fartCloud.body.allowGravity = false;
      this.fartCloud.anims.createFromAseprite("fart");
      this.fartCloud.setVisible(false);
      this.fartCloud.setActive(false);
    }

    if (this.body.blocked.down) {

      this.fartCloud.setActive(true).setVisible(true);
      this.fartCloud.setFlipX(!this.flipX)
      this.fartCloud.setAngle(0);
      this.fartCloud.anims.play({
        key: "idle",
        frameRate: 20,
        repeat: -1
      }, true)

    } else {
      this.fartCloud.setActive(true).setVisible(true);
      this.fartCloud.setFlipX(!this.flipX)
      this.fartCloud.setAngle(this.flipX ? 90 : -90);
      this.setVelocityY(-220);
      this.fartCloud.anims.play({
        key: "idle",
        frameRate: 20,
        repeat: -1
      }, true)
    }
    this.increaseFartLevel(-1);

    this.scene.time.delayedCall(50, () => {
      this.farting = false;
      this.fartCloud.setVisible(false).setActive(false)
    })
  }

  private checkFartPosition() {
    if (this.fartCloud) {
      if (this.body.blocked.down) {
        const fartOffsetX = this.flipX ? 94 : -94;
        this.fartCloud.setPosition(this.x + fartOffsetX, this.y - 32);
      } else {
        this.fartCloud.setPosition(this.x, this.y + 48);
      }
    }
  }

  public canPoo() {
    return !this.pooing && !this.punching && !this.isStepDownState && this.pooLevel > 0;
  }

  public isPooing() {
    return this.pooing;
  }

  public punch() {
    if (this.punching) {
      return;
    }
    this.punching = true;

    this.scene.time.addEvent({
      delay: 200,
      callback: () => {
        this.punching = false;
      }
    })
  }

  public takeDamage(amount?: number) {
    this.life -= amount || 1;
  }

  public isDead() {
    return this.life <= 0;
  }

  public stopMovement() {
    this.setVelocityX(0);
  }

  public stepDown() {
    this.isStepDownState = true;
    this.scene.time.addEvent({
      delay: 200,
      callback: () => {
        this.isStepDownState = false;
      }
    })
  }

  public isStepDown() {
    return this.isStepDownState;
  }

  public getPooLevel() {
    return this.pooLevel;
  }

  public increasePooLevel(value: number = 1) {
    this.pooLevel += value;
    if (this.pooLevel >= MAX_POO_LEVEL) {
      this.pooLevel = MAX_POO_LEVEL;
    }
  }

  public increaseBristolScale(value: number) {
    this.bristolLevel += value;
    if (this.bristolLevel >= MAX_BRISTOL_LEVEL) {
      this.bristolLevel = MAX_BRISTOL_LEVEL;
    }
    if (this.bristolLevel <= 0) {
      this.bristolLevel = 0;
    }
  }

  public increaseFartLevel(value: number = 1) {
    this.fartLevel += value;
    if (this.fartLevel >= MAX_FART_LEVEL) {
      this.fartLevel = MAX_FART_LEVEL;
    }
    if (this.fartLevel <= 0) {
      this.fartLevel = 0;
    }
  }

  public getBristolLevel() {
    return this.bristolLevel;
  }

  public decreasePooLevel(value: number = 1) {
    this.pooLevel -= value;
    if (this.pooLevel <= 0) {
      this.pooLevel = 0;
    }
  }

  private getKidVelolity() {
    const normalVelocity = KID_VELOCITY_X;
    const bristolRate = this.bristolLevel / MAX_BRISTOL_LEVEL;
    const bristolVelocity = normalVelocity - (normalVelocity * bristolRate * 0.5);
    return Math.max(bristolVelocity, MIN_KID_VELOCITY_X);
  }

  public getFartLevel() {
    return this.fartLevel;
  }

  public eat(food: Food) {
    this.increasePooLevel(food.getPooValue());
    this.increaseBristolScale(food.getBristolValue());
    this.increaseFartLevel(food.getFartValue());
    food.destroy();
  }

  // Poo
  // --------------


  // animations 
  // --------------

  private playPooAnimation() {
    this.anims.play({
      key: "poo",
      frameRate: 20
    }, true);
  }

  private playPunchAnimation() {
    this.anims.play({
      key: "punch",
      frameRate: 20
    }, true);
  }

  private playJumpAnimation() {
    this.anims.play({
      key: "jump",
      frameRate: 20
    }, true);
  }

  private playFallAnimation() {
    this.anims.play({
      key: "fall",
      frameRate: 30
    }, true);
  }

  private playWalkAnimation() {
    this.anims.play({
      key: "walk",
      frameRate: 20
    }, true);
  }

  private playFartAnimation() {
    this.anims.play({
      key: "fart_jump",
      frameRate: 20
    }, true);
  }

  private playIdleAnimation() {
    this.anims.play("idle", true);
  }

  private playAnimation() {
    if (!this.body) return;

    if (this.pooing) {
      this.playPooAnimation();
      return;
    }

    if (this.farting) {
      if (this.body.blocked.down) {
        this.playPooAnimation();
      } else {
        this.playFartAnimation();
      }
      return;
    }

    if (this.punching) {
      this.playPunchAnimation();
      return;
    }

    if (this.body.blocked.down) {
      if (this.body.velocity.x !== 0) {
        this.playWalkAnimation();
        return;
      } else {
        this.playIdleAnimation();
        return;
      }
    } else {
      if (this.body.velocity.y < 0) {
        this.playJumpAnimation();
        return;
      } else {
        this.playFallAnimation();
        return;
      }
    }
  }





}