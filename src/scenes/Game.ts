import Phaser from 'phaser';

export class Game extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private ground!: Phaser.GameObjects.TileSprite;
  private groundCollider!: Phaser.Physics.Arcade.StaticGroup;
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
    this.gameOver = false;
    this.score = 0;

    this.ground = this.add.tileSprite(400, 568, 800, 32, 'ground');
    this.groundCollider = this.physics.add.staticGroup();
    const groundColliderSprite = this.groundCollider.create(400, 568, 'ground') as Phaser.Physics.Arcade.Sprite;
    groundColliderSprite.setDisplaySize(800, 32);
    groundColliderSprite.setVisible(false);
    groundColliderSprite.refreshBody();

    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setCollideWorldBounds(true);

    this.obstacles = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.physics.add.collider(this.player, this.groundCollider);
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

    this.input.on('pointerdown', () => {
      if (this.gameOver) {
        this.scene.restart();
      }
    });
  }

  update() {
    if (this.gameOver) {
      return;
    }

    this.ground.tilePositionX += 2;

    if (this.cursors.space.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }

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
    if (this.gameOver) {
      return;
    }
    const obstacle = this.obstacles.create(800, 552, 'obstacle') as Phaser.Physics.Arcade.Sprite;
    obstacle.setVelocityX(-100);
    obstacle.setOrigin(0.5, 1);
  }

  private handleGameOver() {
    if (this.gameOver) {
      return;
    }
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.gameOver = true;
    this.gameOverText.setVisible(true);
  }
}
