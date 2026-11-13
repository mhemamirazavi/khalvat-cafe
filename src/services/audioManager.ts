import { Howl, Howler } from 'howler';
import useCafeStore, { type WeatherType } from '../store/useCafeStore';

/**
 * Ambient weather audio manager.
 * Subscribes to the cafe store once (at module import) and keeps a single
 * looping Howl per weather type. Muted => everything stops; unmuting resumes
 * the loop for the current weather.
 *
 * Expected files (public/audio/): rain.ogg|rain.wav and wind.ogg|wind.wav
 * (wind is shared by autumn and snow). Missing .ogg falls back to .wav.
 */
// Howler tries each source in order, so a missing .ogg falls back to the .wav.
const SOUND_SRC: Record<WeatherType, string[]> = {
  rain: ['/audio/rain.ogg', '/audio/rain.wav'],
  autumn: ['/audio/wind.ogg', '/audio/wind.wav'],
  snow: ['/audio/wind.ogg', '/audio/wind.wav'],
};

const VOLUME: Record<WeatherType, number> = {
  rain: 0.5,
  autumn: 0.4,
  snow: 0.35,
};

class AudioManager {
  private sounds = new Map<WeatherType, Howl>();
  private current?: WeatherType;
  private unlocked = false;

  init() {
    // Browser autoplay policy: start audio only after the first user gesture.
    const unlock = () => {
      this.unlocked = true;
      void Howler.ctx?.resume?.();
      this.sync();
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    useCafeStore.subscribe((next, previous) => {
      if (next.weather !== previous.weather || next.isMuted !== previous.isMuted) this.sync();
    });
    this.sync();
  }

  private get(weather: WeatherType): Howl {
    let howl = this.sounds.get(weather);
    if (!howl) {
      howl = new Howl({
        src: SOUND_SRC[weather],
        loop: true,
        volume: 0,
        onloaderror: (_id, err) =>
          console.warn(`[audioManager] could not load ${SOUND_SRC[weather][0]}`, err),
      });
      this.sounds.set(weather, howl);
    }
    return howl;
  }

  private sync() {
    const { weather, isMuted } = useCafeStore.getState();
    // Muted or not yet unlocked by a gesture: silence everything.
    if (isMuted || !this.unlocked) {
      this.stopAll();
      this.current = undefined;
      return;
    }
    if (this.current === weather) return;
    // Cross-fade the previous loop out while the new one fades in.
    if (this.current && this.current !== weather) {
      const old = this.sounds.get(this.current);
      if (old?.playing()) {
        old.fade(old.volume(), 0, 500);
        old.once('fade', () => old.stop());
      }
    }
    const next = this.get(weather);
    if (!next.playing()) next.play();
    next.fade(next.volume(), VOLUME[weather], 700);
    this.current = weather;
  }

  private stopAll() {
    this.sounds.forEach((howl) => { if (howl.playing()) howl.stop(); });
  }
}

export const audioManager = new AudioManager();
// Self-initializing singleton: importing this module is enough.
audioManager.init();
export default audioManager;
