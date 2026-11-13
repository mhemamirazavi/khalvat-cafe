import { Events } from 'phaser';

// Used to emit events between React components, HTML and Phaser scenes
export const EventBus = new Events.EventEmitter();
export default EventBus;
