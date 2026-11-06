import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import fallback from "@/assets/merch-gelang-exterior.jpg";

export function BraceletSpinner() {
  const host = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const [isPaused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};
    import("three").then((T) => {
      if (disposed) return;
      const css = getComputedStyle(el);
      const navy = css.getPropertyValue("--bracelet-band").trim();
      const ink = css.getPropertyValue("--bracelet-letter").trim();
      const blue = css.getPropertyValue("--bracelet-blue").trim();
      const violet = css.getPropertyValue("--bracelet-violet").trim();
      let renderer: InstanceType<typeof T.WebGLRenderer>;
      try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true }); } catch { return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setClearColor(0, 0);
      el.appendChild(renderer.domElement);
      renderer.domElement.setAttribute("aria-label", "Gelang 3D Nempo dan Kala Muda, kedua tulisan di sisi luar");
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 3.8, 7.6);
      camera.lookAt(0, 0, 0);
      scene.add(new T.HemisphereLight(ink, navy, 3));
      const light = new T.DirectionalLight(ink, 4);
      light.position.set(3, 5, 4); scene.add(light);
      const canvas = document.createElement("canvas");
      canvas.width = 4096; canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (!ctx) { renderer.dispose(); renderer.domElement.remove(); return; }
      ctx.fillStyle = navy; ctx.fillRect(0, 0, 4096, 512);
      const stripe = ctx.createLinearGradient(0, 0, 4096, 0);
      stripe.addColorStop(0, blue); stripe.addColorStop(.5, violet); stripe.addColorStop(1, blue);
      ctx.fillStyle = stripe; ctx.fillRect(0, 28, 4096, 22);
      ctx.fillStyle = ink; ctx.font = "bold 210px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("nempo", 1024, 285); ctx.fillText("KALA MUDA", 3072, 285);
      const texture = new T.CanvasTexture(canvas); texture.colorSpace = T.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const outer = new T.MeshStandardMaterial({ map: texture, roughness: .6 });
      const inner = new T.MeshStandardMaterial({ color: navy, roughness: .7, side: T.BackSide });
      const rim = new T.MeshStandardMaterial({ color: blue, roughness: .5, side: T.DoubleSide });
      const band = new T.Group();
      band.add(new T.Mesh(new T.CylinderGeometry(2, 2, .62, 160, 1, true), outer));
      band.add(new T.Mesh(new T.CylinderGeometry(1.82, 1.82, .62, 160, 1, true), inner));
      for (const y of [-.31, .31]) {
        const edge = new T.Mesh(new T.RingGeometry(1.82, 2, 160), rim);
        edge.rotation.x = -Math.PI / 2; edge.position.y = y; band.add(edge);
      }
      band.rotation.y = -Math.PI / 2;
      scene.add(band);
      const resize = () => { const w = el.clientWidth, h = el.clientHeight; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
      const ro = new ResizeObserver(resize); ro.observe(el); resize();
      let last = performance.now(), raf = 0, dragX: number | null = null;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)");
      const tick = (now: number) => {
        const dt = Math.min(.05, (now - last) / 1000); last = now;
        if (!paused.current && !reduce.matches && dragX === null) band.rotation.y += dt * .65;
        renderer.render(scene, camera); raf = requestAnimationFrame(tick);
      };
      const down = (e: PointerEvent) => { dragX = e.clientX; el.setPointerCapture(e.pointerId); };
      const move = (e: PointerEvent) => { if (dragX === null) return; band.rotation.y += (e.clientX - dragX) * .012; dragX = e.clientX; };
      const up = () => { dragX = null; };
      el.addEventListener("pointerdown", down); el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
      raf = requestAnimationFrame(tick); setReady(true);
      cleanup = () => {
        cancelAnimationFrame(raf); ro.disconnect();
        el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up);
        band.children.forEach((child) => { if (child instanceof T.Mesh) child.geometry.dispose(); });
        texture.dispose(); outer.dispose(); inner.dispose(); rim.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
    }).catch(() => {});
    return () => { disposed = true; cleanup(); };
  }, []);
  return <div className="bracelet-display bg-card relative flex flex-col justify-center">
    <div ref={host} className="relative aspect-square w-full touch-pan-y cursor-grab overflow-hidden">
      {!ready && <img src={fallback} alt="Gelang Nempo × Kala Muda, tulisan pada sisi luar" width={1024} height={1024} className="h-full w-full object-contain" />}
    </div>
    {ready && <Button variant="outline" size="icon" className="absolute bottom-5 right-5" title={isPaused ? "Putar gelang" : "Jeda putaran gelang"} aria-label={isPaused ? "Putar gelang" : "Jeda putaran gelang"} onClick={() => { paused.current = !paused.current; setPaused(paused.current); }}>{isPaused ? <Play /> : <Pause />}</Button>}
  </div>;
}