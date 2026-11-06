import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import nempoLogo from "@/assets/nempo-bumper-logo-white.png";
import kalaMudaLogo from "@/assets/kala-muda-logo.png";

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function LanyardSpinner() {
  const host = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const [isPaused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};
    Promise.all([
      import("three"),
      import("three/examples/jsm/environments/RoomEnvironment.js"),
      loadImage(nempoLogo),
      loadImage(kalaMudaLogo),
    ]).then(([T, { RoomEnvironment }, nempo, kala]) => {
      if (disposed) return;
      const css = getComputedStyle(el);
      const navy = css.getPropertyValue("--lanyard-band").trim();
      const deep = css.getPropertyValue("--lanyard-deep").trim();
      const ink = css.getPropertyValue("--lanyard-letter").trim();
      const blue = css.getPropertyValue("--lanyard-blue").trim();
      const violet = css.getPropertyValue("--lanyard-violet").trim();
      const metal = css.getPropertyValue("--lanyard-metal").trim();

      let renderer: InstanceType<typeof T.WebGLRenderer>;
      try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true }); } catch { return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setClearColor(0, 0);
      el.appendChild(renderer.domElement);
      renderer.domElement.setAttribute("aria-label", "Lanyard 3D Nempo dan Kala Muda dengan ID card");

      const scene = new T.Scene();
      const pmrem = new T.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;
      scene.environmentIntensity = 0.55;
      const camera = new T.PerspectiveCamera(30, 3 / 4, 0.1, 100);
      camera.position.set(0, 0.6, 15.2);
      camera.lookAt(0, 0.1, 0);
      const key = new T.DirectionalLight(ink, 2.2);
      key.position.set(3, 4, 6); scene.add(key);
      const fill = new T.DirectionalLight(violet, 0.8);
      fill.position.set(-4, 1, -3); scene.add(fill);

      const textures: InstanceType<typeof T.Texture>[] = [];
      const maxAniso = renderer.capabilities.getMaxAnisotropy();
      const toTexture = (canvas: HTMLCanvasElement) => {
        const t = new T.CanvasTexture(canvas);
        t.colorSpace = T.SRGBColorSpace; t.anisotropy = maxAniso;
        textures.push(t); return t;
      };

      // ---- Strap texture: one repeating tile, aspect matches the physical strap.
      const STRAP_W = 0.36;
      const tile = document.createElement("canvas");
      tile.width = 1536; tile.height = 128;
      const tc = tile.getContext("2d");
      if (!tc) { renderer.dispose(); renderer.domElement.remove(); return; }
      tc.fillStyle = navy; tc.fillRect(0, 0, 1536, 128);
      const edge = tc.createLinearGradient(0, 0, 1536, 0);
      edge.addColorStop(0, blue); edge.addColorStop(0.5, violet); edge.addColorStop(1, blue);
      tc.fillStyle = edge; tc.fillRect(0, 6, 1536, 12); tc.fillRect(0, 110, 1536, 12);
      tc.fillStyle = ink; tc.textBaseline = "middle"; tc.textAlign = "center";
      tc.font = "bold 62px Arial";
      tc.fillText("nempo", 260, 66);
      tc.font = "bold 50px Arial";
      tc.fillText("KALA MUDA", 1030, 66);
      tc.fillStyle = edge;
      for (const x of [600, 1440]) { tc.beginPath(); tc.arc(x, 64, 11, 0, Math.PI * 2); tc.fill(); }
      const tileLen = STRAP_W * (1536 / 128);
      const strapTex = toTexture(tile);
      strapTex.wrapS = T.RepeatWrapping;
      const strapTexBack = strapTex.clone();
      strapTexBack.repeat.x = -1; strapTexBack.needsUpdate = true; textures.push(strapTexBack);

      // ---- Strap loop: from the clip, up around the back of the neck, and back down.
      const loopZ = -0.35;
      const curve = new T.CatmullRomCurve3([
        [-0.05, 0, 0.42], [-0.42, 1.0, 0.36], [-0.88, 2.2, 0.16], [-1.12, 3.1, -0.22],
        [-0.86, 3.58, -0.72], [0, 3.78, -1.0], [0.86, 3.58, -0.72], [1.12, 3.1, -0.22],
        [0.88, 2.2, 0.16], [0.42, 1.0, 0.36], [0.05, 0, 0.42],
      ].map(([x, y, z]) => new T.Vector3(x, y, z)), false, "centripetal");
      const N = 320;
      const length = curve.getLength();
      const pos: number[] = [], uv: number[] = [], idx: number[] = [];
      const p = new T.Vector3(), t = new T.Vector3(), n = new T.Vector3(), w = new T.Vector3();
      for (let i = 0; i <= N; i++) {
        const s = i / N;
        curve.getPointAt(s, p); curve.getTangentAt(s, t);
        n.set(p.x, 0, p.z - loopZ).normalize();
        n.addScaledVector(t, -n.dot(t)).normalize();
        w.crossVectors(t, n).normalize();
        // Strap ends narrow slightly where they are folded into the metal crimp.
        const end = Math.min(s, 1 - s);
        const half = (STRAP_W / 2) * (end < 0.05 ? 0.7 + 0.3 * (end / 0.05) : 1);
        pos.push(p.x - w.x * half, p.y - w.y * half, p.z - w.z * half, p.x + w.x * half, p.y + w.y * half, p.z + w.z * half);
        const u = (s * length) / tileLen;
        uv.push(u, 0, u, 1);
        if (i < N) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
      }
      const strapGeo = new T.BufferGeometry();
      strapGeo.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
      strapGeo.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
      strapGeo.setIndex(idx); strapGeo.computeVertexNormals();
      const strapFront = new T.MeshStandardMaterial({ map: strapTex, roughness: 0.78, side: T.FrontSide });
      const strapBack = new T.MeshStandardMaterial({ map: strapTexBack, roughness: 0.78, side: T.BackSide });

      const lanyard = new T.Group();
      lanyard.add(new T.Mesh(strapGeo, strapFront), new T.Mesh(strapGeo, strapBack));

      // ---- Hardware: crimp, swivel ring, trigger hook, card ring.
      const chrome = new T.MeshStandardMaterial({ color: metal, metalness: 1, roughness: 0.22 });
      const crimp = new T.Mesh(new T.BoxGeometry(0.4, 0.22, 0.1, 1, 1, 1), chrome);
      crimp.position.set(0, -0.02, 0.42);
      const ringTop = new T.Mesh(new T.TorusGeometry(0.08, 0.022, 12, 32), chrome);
      ringTop.position.set(0, -0.2, 0.42);
      const hook = new T.Mesh(new T.CapsuleGeometry(0.06, 0.26, 6, 16), chrome);
      hook.position.set(0, -0.48, 0.42);
      const ringCard = new T.Mesh(new T.TorusGeometry(0.1, 0.022, 12, 32), chrome);
      ringCard.rotation.y = Math.PI / 2;
      ringCard.position.set(0, -0.74, 0.42);
      lanyard.add(crimp, ringTop, hook, ringCard);

      // ---- ID card (portrait CR80 proportions) inside a clear holder.
      const CW = 1.6, CH = 2.54, CARD_TOP = -0.9;
      const S = 400; // px per unit
      const front = document.createElement("canvas"); front.width = CW * S; front.height = CH * S;
      const back = document.createElement("canvas"); back.width = CW * S; back.height = CH * S;
      const fc = front.getContext("2d"), bc = back.getContext("2d");
      if (fc && bc) {
        const W = front.width, H = front.height;
        for (const c of [fc, bc]) {
          roundRect(c, 0, 0, W, H, 40); c.save(); c.clip();
          const bg = c.createLinearGradient(0, 0, W * 0.4, H);
          bg.addColorStop(0, navy); bg.addColorStop(1, deep);
          c.fillStyle = bg; c.fillRect(0, 0, W, H);
          const glow = c.createRadialGradient(W * 0.85, H * 0.12, 10, W * 0.85, H * 0.12, W * 0.9);
          glow.addColorStop(0, violet); glow.addColorStop(1, "transparent");
          c.globalAlpha = 0.45; c.fillStyle = glow; c.fillRect(0, 0, W, H); c.globalAlpha = 1;
          // Blue-violet wave across the lower part, echoing the strap edges.
          const wave = c.createLinearGradient(0, 0, W, 0);
          wave.addColorStop(0, blue); wave.addColorStop(1, violet);
          c.fillStyle = wave;
          c.beginPath(); c.moveTo(0, H * 0.8); c.bezierCurveTo(W * 0.35, H * 0.72, W * 0.65, H * 0.9, W, H * 0.78);
          c.lineTo(W, H); c.lineTo(0, H); c.closePath(); c.fill();
          c.restore();
          // Holder slot, punched through the top.
          c.globalCompositeOperation = "destination-out";
          roundRect(c, W / 2 - 90, 34, 180, 30, 15); c.fill();
          c.globalCompositeOperation = "source-over";
        }
        // Front: logos, member pass.
        fc.textAlign = "center"; fc.textBaseline = "middle";
        if (nempo) {
          const lw = W * 0.56, lh = lw * (nempo.height / nempo.width);
          fc.drawImage(nempo, (W - lw) / 2, 120, lw, lh);
        }
        fc.fillStyle = ink; fc.globalAlpha = 0.7; fc.font = "bold 46px Arial";
        fc.fillText("×", W / 2, 520); fc.globalAlpha = 1;
        if (kala) {
          const lw = W * 0.62, lh = lw * (kala.height / kala.width);
          fc.drawImage(kala, (W - lw) / 2, 570, lw, lh);
        }
        fc.strokeStyle = ink; fc.globalAlpha = 0.25; fc.lineWidth = 3;
        fc.beginPath(); fc.moveTo(90, 760); fc.lineTo(W - 90, 760); fc.stroke(); fc.globalAlpha = 1;
        fc.fillStyle = ink; fc.font = "900 112px Arial";
        fc.fillText("CREW", W / 2, 840);
        fc.font = "bold 30px Arial"; fc.globalAlpha = 0.8;
        fc.fillText("M E M B E R   P A S S", W / 2, 910); fc.globalAlpha = 1;
        fc.font = "bold 34px Arial";
        fc.fillText("KOMUNITAS KALA MUDA", W / 2, H - 70);
        // Back: big "n" emblem.
        bc.textAlign = "center"; bc.textBaseline = "middle";
        if (nempo) {
          const sx = nempo.width * 0.32, sy = nempo.height * 0.07, sw = nempo.width * 0.36, sh = nempo.height * 0.58;
          const dw = W * 0.58, dh = dw * (sh / sw);
          bc.globalAlpha = 0.95; bc.drawImage(nempo, sx, sy, sw, sh, (W - dw) / 2, 170, dw, dh); bc.globalAlpha = 1;
        }
        bc.fillStyle = ink; bc.font = "bold 40px Arial";
        bc.fillText("nempo  ×  KALA MUDA", W / 2, 760);
        bc.font = "bold 30px Arial"; bc.globalAlpha = 0.8;
        bc.fillText("KOMUNITAS KALA MUDA", W / 2, H - 70); bc.globalAlpha = 1;
      }
      const edgeMat = new T.MeshStandardMaterial({ color: deep, roughness: 0.5 });
      const faceFront = new T.MeshStandardMaterial({ map: toTexture(front), roughness: 0.35, transparent: true, alphaTest: 0.5 });
      const faceBack = new T.MeshStandardMaterial({ map: toTexture(back), roughness: 0.35, transparent: true, alphaTest: 0.5 });
      const card = new T.Mesh(new T.BoxGeometry(CW, CH, 0.025), [edgeMat, edgeMat, edgeMat, edgeMat, faceFront, faceBack]);
      card.position.set(0, CARD_TOP - CH / 2 + 0.02, 0.42);
      // Clear sleeve slightly larger than the card.
      const sleeveMat = new T.MeshPhysicalMaterial({
        color: ink, transparent: true, opacity: 0.12, roughness: 0.04, metalness: 0, clearcoat: 1, depthWrite: false,
      });
      const sleeve = new T.Mesh(new T.BoxGeometry(CW + 0.12, CH + 0.16, 0.07), sleeveMat);
      sleeve.position.set(0, CARD_TOP - (CH + 0.16) / 2 + 0.1, 0.42);
      sleeve.renderOrder = 2;
      lanyard.add(card, sleeve);

      // Center the whole piece on the turntable axis (card face sits on the axis).
      lanyard.position.z = -0.42;
      const turntable = new T.Group();
      turntable.add(lanyard); scene.add(turntable);

      const resize = () => {
        const wpx = el.clientWidth, hpx = el.clientHeight;
        renderer.setSize(wpx, hpx); camera.aspect = wpx / hpx; camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize); ro.observe(el); resize();
      let last = performance.now(), raf = 0, dragX: number | null = null;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)");
      const tick = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        // Pure yaw at a constant speed: no sway, bob or tilt.
        if (!paused.current && !reduce.matches && dragX === null) turntable.rotation.y += dt * 0.65;
        renderer.render(scene, camera); el.dataset.sceneReady = "true";
        raf = requestAnimationFrame(tick);
      };
      const down = (e: PointerEvent) => { dragX = e.clientX; el.setPointerCapture(e.pointerId); };
      const move = (e: PointerEvent) => { if (dragX === null) return; turntable.rotation.y += (e.clientX - dragX) * 0.012; dragX = e.clientX; };
      const up = () => { dragX = null; };
      el.addEventListener("pointerdown", down); el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
      raf = requestAnimationFrame(tick); setReady(true);
      cleanup = () => {
        cancelAnimationFrame(raf); ro.disconnect();
        el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up);
        scene.traverse((o) => {
          if (o instanceof T.Mesh) {
            o.geometry.dispose();
            (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
          }
        });
        textures.forEach((x) => x.dispose()); envTex.dispose(); pmrem.dispose();
        renderer.dispose(); renderer.domElement.remove();
      };
    }).catch(() => {});
    return () => { disposed = true; cleanup(); };
  }, []);

  return (
    <div className="lanyard-display bg-card relative flex flex-col justify-center py-6">
      <div ref={host} className="relative aspect-[3/4] w-full touch-pan-y cursor-grab overflow-hidden" style={{ maxWidth: 340, marginInline: "auto" }}>
        {!ready && <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">Memuat lanyard 3D…</div>}
      </div>
      {ready && (
        <Button
          variant="outline" size="icon"
          title={isPaused ? "Putar lanyard" : "Jeda putaran lanyard"}
          aria-label={isPaused ? "Putar lanyard" : "Jeda putaran lanyard"}
          onClick={() => { paused.current = !paused.current; setPaused(paused.current); }}
        >
          {isPaused ? <Play /> : <Pause />}
        </Button>
      )}
    </div>
  );
}
