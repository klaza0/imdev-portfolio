/** Tiny synthesized sounds. Nothing plays until the visitor has interacted with the page. */
export function createSfx() {
  let ctx: AudioContext | null = null;
  let out: GainNode | null = null;
  let disposed = false;

  const ensure = () => {
    if (disposed || document.hidden) return null;
    const ua = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
    if (ua && !ua.hasBeenActive) return null;
    try {
      if (!ctx) {
        ctx = new AudioContext();
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -18;
        comp.ratio.value = 8;
        comp.connect(ctx.destination);
        out = ctx.createGain();
        out.gain.value = 0.22;
        out.connect(comp);
      }
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
    } catch {
      return null;
    }
    return ctx.state === "closed" ? null : ctx;
  };

  const tone = (freq: number, start: number, dur: number, type: OscillatorType, peak: number) => {
    if (!ctx || !out) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(peak, start + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g).connect(out);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  };

  // Warm the context on the first gesture so the first sounds are not dropped while it resumes.
  const unlock = () => ensure();
  const gestures = ["pointerdown", "pointerup", "touchend", "keydown"] as const;
  gestures.forEach((g) => window.addEventListener(g, unlock, true));

  return {
    ring() {
      const c = ensure();
      if (!c) return false;
      const notes = [1319, 1175, 740, 831, 1109, 988, 587, 659, 988, 880, 554, 659, 880];
      const lens = [1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 4];
      let at = c.currentTime + 0.02;
      notes.forEach((f, i) => {
        const d = 0.085 * lens[i];
        tone(f, at, d * 0.95, "square", 0.18);
        at += d;
      });
      return true;
    },
    dispose() {
      disposed = true;
      gestures.forEach((g) => window.removeEventListener(g, unlock, true));
      if (ctx && ctx.state !== "closed") ctx.close().catch(() => {});
    },
  };
}

export type Sfx = ReturnType<typeof createSfx>;
