import { BlobBomb } from "../generic/BlobBomb";
import { PaperBomb } from "../generic/PaperBomb";
import { Enemy } from "./Enemy";

export class Zeppelin extends Enemy {

  private paperBombs: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "zeppelin");
    this.playIdleAnimation();
    this.scene.time.addEvent({
      delay: 4000,
      loop: true,
      callback: () => {
        switch (Phaser.Math.Between(1, 3)) {
          case 1: this.dropBlob(); break;
          case 2: this.dropPaper(); break;
          default: break;
        }
      }
    })
  }

  public setPapers(paperBombs: Phaser.Physics.Arcade.Group) {
    this.paperBombs = paperBombs;
  }

  private playIdleAnimation() {
    this.anims.play({
      key: "idle",
      frameRate: 10,
      repeat: -1
    }, true);
  }

  private dropBlob() {
    this.scene.time.addEvent({
      delay: 200,
      repeat: 3,
      callback: () => {
        const blob = new BlobBomb(
          this.scene,
          this.x + 20,
          this.y - 40,
          this.bullets
        );
        this.bullets.add(blob);
        // @ts-ignore
        blob.body.allowGravity = true;
        blob.setVelocity(this.body.velocity.x);
      }
    })
  }

  private dropPaper() {
    const paper = new PaperBomb(
      this.scene,
      this.x + 20,
      this.y - 40,
    );
    this.paperBombs.add(paper);
    paper.setScale(1);
    // @ts-ignore
    paper.body.allowGravity = true;
    paper.setBounce(0.3);
    paper.setVelocityX(this.body.velocity.x)
  }
}