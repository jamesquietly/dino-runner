import Phaser from 'phaser';

export class Game extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.Group;
  private obstacles!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private gameOver: boolean = false;
  private gameOverText!: Phaser.GameObjects.Text;

  constructor() {
    super('game');
  }

  create() {
    this.platforms = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    for (let i = 0; i < 5; i++) {
      const platform = this.platforms.create(i * 200, 568, 'platform') as Phaser.Physics.Arcade.Sprite;
      platform.setVelocityX(-100);
    }

    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setCollideWorldBounds(true);

    this.obstacles = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.obstacles, this.handleGameOver, undefined, this);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      color: '#fff',
    });

    this.time.addEvent({
      delay: 2000,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true,
    });

    this.gameOverText = this.add.text(400, 300, 'Game Over', {
      fontSize: '64px',
      color: '#ff0000',
    });
    this.gameOverText.setOrigin(0.5);
    this.gameOverText.setVisible(false);
  }

  update() {
    if (this.gameOver) {
      return;
    }

    if (this.cursors.space.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }

    this.platforms.children.iterate((platform) => {
      const platformSprite = platform as Phaser.Physics.Arcade.Sprite;
      if (platformSprite.x < -100) {
        platformSprite.x = 800 + (Math.random() * 200);
      }
      return true;
    });

    this.obstacles.children.iterate((obstacle) => {
      const obstacleSprite = obstacle as Phaser.Physics.Arcade.Sprite;
      if (obstacleSprite.x < -100) {
        obstacleSprite.destroy();
        this.score++;
        this.scoreText.setText('Score: ' + this.score);
      }
      return true;
    });
  }

  private spawnObstacle() {
    const obstacle = this.obstacles.create(800, 500, 'obstacle') as Phaser.Physics.Arcade.Sprite;
    obstacle.setVelocityX(-100);
  }

  private handleGameOver() {
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.gameOver = true;
    this.gameOverText.setVisible(true);

    this.input.once('pointerdown', () => {
      this.scene.restart();
    });
  }
}
