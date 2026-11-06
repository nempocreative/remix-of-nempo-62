// Pure math for the 360° photo spinner on the merchandise page.
// `pos` counts frames (1.0 = one photo angle further). Between two angles the
// current photo tilts from +swing to -swing; during the last part of the step the
// next photo fades in on top, tilted exactly 2×swing ahead (its own angle), so the
// two layers line up and no double image or flicker shows.

export type SpinState = {
  /** Index of the photo underneath (fully opaque). */
  a: number;
  /** Index of the next photo fading in on top. */
  b: number;
  rotA: number;
  rotB: number;
  /** Opacity of photo `b` (0…1). */
  fade: number;
};

export const FADE_PORTION = 0.4;

export function spinState(pos: number, n: number, swing: number): SpinState {
  const p = ((pos % n) + n) % n;
  const a = Math.floor(p) % n;
  const f = p - Math.floor(p);
  const t = Math.max(0, (f - (1 - FADE_PORTION)) / FADE_PORTION);
  const fade = t * t * (3 - 2 * t);
  return {
    a,
    b: (a + 1) % n,
    rotA: swing * (1 - 2 * f),
    rotB: swing * (3 - 2 * f),
    fade,
  };
}
