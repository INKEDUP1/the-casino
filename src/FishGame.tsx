import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const FishGame: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: {
        preload,
        create,
        update,
      },
      parent: gameRef.current || undefined,
    };

    const game = new Phaser.Game(config);

    const fishTypes = [
      { key: 'fish1', value: 10, speed: 100 },
      { key: 'fish2', value: 20, speed: 150 },
      { key: 'fish3', value: 50, speed: 80 },
    ];

    let fish: Phaser.Physics.Arcade.Image;
    let shootSound: Phaser.Sound.BaseSound;
    let hitSound: Phaser.Sound.BaseSound;

    function preload(this: Phaser.Scene) {
      this.load.image('bg', '/fishgame/bg.png');
      this.load.image('bullet', '/fishgame/bullet.png');
      this.load.audio('shoot', '/sounds/shoot.wav');
      this.load.audio('hit', '/sounds/hit.wav');
      fishTypes.forEach(f => this.load.image(f.key, `/fishgame/${f.key}.png`));
    }

    function spawnFish(this: Phaser.Scene) {
      const chosen = Phaser.Math.RND.pick(fishTypes);
      fish = this.physics.add.image(
        Phaser.Math.Between(50, 750),
        Phaser.Math.Between(50, 500),
        chosen.key
      );
      fish.setData('value', chosen.value);
      fish.setVelocity(chosen.speed, chosen.speed / 2);
      fish.setCollideWorldBounds(true);
      fish.setBounce(1);

      this.tweens.add({
        targets: fish,
        angle: { from: -10, to: 10 },
        duration: 300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    function create(this: Phaser.Scene) {
      this.add.image(400, 300, 'bg');

      shootSound = this.sound.add('shoot');
      hitSound = this.sound.add('hit');

      const bullets = this.physics.add.group();
      spawnFish.call(this);

      this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        if (gameOver) return;

        const bullet = this.physics.add.image(400, 560, 'bullet');
        this.physics.moveTo(bullet, pointer.x, pointer.y, 400);
        bullets.add(bullet);
        shootSound.play();

        this.physics.add.overlap(bullet, fish, () => {
          bullet.destroy();
          hitSound.play();
          const baseValue = fish.getData('value') || 0;
          setScore(prev => prev + baseValue * multiplier);
          fish.destroy();
          spawnFish.call(this);
        });
      });
    }

    function update(this: Phaser.Scene) {}

    return () => {
      game.destroy(true);
    };
  }, [multiplier, gameOver]);

  return (
    <div className="relative w-full h-full">
      <div ref={gameRef} className="w-full h-full" />

      <div className="absolute top-2 left-2 text-white text-xl font-bold bg-black bg-opacity-50 px-4 py-2 rounded" style={{ zIndex: 10 }}>
        Coins: {score}
      </div>

      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-xl font-bold bg-black bg-opacity-50 px-4 py-2 rounded" style={{ zIndex: 10 }}>
        Time: {timeLeft}s
      </div>

      <button
        className="absolute top-2 right-2 bg-yellow-400 text-black px-4 py-2 rounded shadow font-bold"
        style={{ zIndex: 10 }}
        onClick={() => {
          if (multiplier > 1 || gameOver) return;
          setMultiplier(2);
          setTimeout(() => setMultiplier(1), 10000);
        }}
      >
        {multiplier > 1 ? '2X Active' : '2X Coins'}
      </button>

      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white text-3xl font-bold" style={{ zIndex: 20 }}>
          Game Over — Final Score: {score}
        </div>
      )}
    </div>
  );
};

export default FishGame;
