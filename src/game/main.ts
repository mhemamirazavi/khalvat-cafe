import { AUTO, Game, Scale } from 'phaser';
import CafeIsometricScene from './scenes/CafeIsometricScene';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#180e0b',
    pixelArt: true,
    scale: {
        mode: Scale.RESIZE,
        autoCenter: Scale.CENTER_BOTH,
    },
    scene: [
        CafeIsometricScene
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
