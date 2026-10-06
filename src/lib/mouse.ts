/* Shared smoothed mouse position (normalized -1..1) used by the 3D scenes
   and any parallax. `x/y` are lerped toward `tx/ty` inside the frame loop. */
export const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

export function initMouse(): () => void {
  const onMove = (e: PointerEvent) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  return () => window.removeEventListener("pointermove", onMove);
}

/** Small per-frame lerp helper for use inside useFrame. */
export function lerpMouse(dt: number): { x: number; y: number } {
  const k = Math.min(1, dt * 3.5);
  mouse.x += (mouse.tx - mouse.x) * k;
  mouse.y += (mouse.ty - mouse.y) * k;
  return { x: mouse.x, y: mouse.y };
}
