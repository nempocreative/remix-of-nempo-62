import { describe, expect, it } from "vitest";
import { spinState } from "./spin-frames";

describe("merchandise 360° spinner", () => {
  it("hands over to the next photo with no jump in tilt", () => {
    const end = spinState(4.9999, 24, 5);
    const next = spinState(5, 24, 5);
    expect(end.b).toBe(5);
    expect(next.a).toBe(5);
    expect(end.fade).toBeCloseTo(1, 3);
    expect(end.rotB).toBeCloseTo(next.rotA, 2);
  });

  it("shows only one photo in the first part of each step", () => {
    expect(spinState(3.3, 24, 5).fade).toBe(0);
  });

  it("wraps from the last angle back to the front", () => {
    const s = spinState(23.8, 24, 5);
    expect(s.a).toBe(23);
    expect(s.b).toBe(0);
    expect(spinState(-0.5, 24, 5).a).toBe(23);
  });
});
