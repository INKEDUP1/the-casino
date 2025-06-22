
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const FishGame: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
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

    let fish: Phaser.Physics.Arcade.Image;
    let bulletGroup: Phaser.Physics.Arcade.Group;

    function preload(this: Phaser.Scene) {
      this.load.image('bg', '/fishgame/bg.png');
      this.load.image('fish', '/fishgame/fish.png');
      this.load.image('bullet', '/fishgame/bullet.png');
    }

    function create(this: Phaser.Scene) {
      this.add.image(400, 300, 'bg');

      fish = this.physics.add.image(100, 100, 'fish');
      fish.setVelocity(100, 40);
      fish.setCollideWorldBounds(true);
      fish.setBounce(1);

      bulletGroup = this.physics.add.group();

      this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        const bullet = this.physics.add.image(400, 560, 'bullet');
        this.physics.moveTo(bullet, pointer.x, pointer.y, 400);
        bulletGroup.add(bullet);

        this.physics.add.overlap(bullet, fish, () => {
          bullet.destroy();
          fish.destroy();
          setScore(prev => prev + 10);

          fish = this.physics.add.image(
            Phaser.Math.Between(50, 750),
            Phaser.Math.Between(50, 500),
            'fish'
          );
          fish.setVelocity(100, 40);
          fish.setCollideWorldBounds(true);
          fish.setBounce(1);
        });
      });
    }

    function update(this: Phaser.Scene) {}

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={gameRef} className="w-full h-full" />
      <div
        className="absolute top-2 left-2 text-white text-xl font-bold bg-black bg-opacity-50 px-4 py-2 rounded"
        style={{ zIndex: 10 }}
      >
        Coins: {score}
      </div>
    </div>
  );
};

export default FishGame;
