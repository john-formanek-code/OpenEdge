'use client';

class SoundService {
  private context: AudioContext | null = null;

  private init() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playDing() {
    this.init();
    if (!this.context) return;
    
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.context.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(440, this.context.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.context.destination);
    
    osc.start();
    osc.stop(this.context.currentTime + 0.3);
  }

  playAlert() {
    this.init();
    if (!this.context) return;
    
    const now = this.context.currentTime;
    [0, 0.15].forEach(delay => {
      if (!this.context) return;
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now + delay);
      
      gain.gain.setValueAtTime(0.05, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.1);
      
      osc.connect(gain);
      gain.connect(this.context.destination);
      
      osc.start(now + delay);
      osc.stop(now + delay + 0.1);
    });
  }
}

export const sounds = typeof window !== 'undefined' ? new SoundService() : { playDing: () => {}, playAlert: () => {} };
