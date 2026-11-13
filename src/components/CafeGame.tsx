import React, { useEffect, useRef } from 'react';
import { AUTO, Game, Scale } from 'phaser';
import CafeIsometricScene from '../game/scenes/CafeIsometricScene';

export interface CafeGameProps {
  className?: string;
  style?: React.CSSProperties;
}

export function CafeGame({ className, style }: CafeGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: AUTO,
      parent: containerRef.current,
      width: '100%',
      height: '100%',
      scale: {
        mode: Scale.RESIZE,
        autoCenter: Scale.CENTER_BOTH,
      },
      backgroundColor: '#180e0b',
      pixelArt: true,
      scene: [CafeIsometricScene],
    };

    gameRef.current = new Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="cafe-game-stage"
      className={`fixed inset-0 z-0 ${className || ''}`.trim()}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        overflow: 'hidden',
        ...style,
      }}
    />
  );
}

export default CafeGame;
