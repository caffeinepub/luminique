let audioCtx: AudioContext | null = null;

export function playChime(): void {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioCtx;

    // Play a pleasant two-note chime
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playNote(880, now, 0.8);
    playNote(1108, now + 0.15, 0.7);
    playNote(1320, now + 0.3, 0.9);
  } catch (e) {
    // Silently fail if audio context not available
  }
}
