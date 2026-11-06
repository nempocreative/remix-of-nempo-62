import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Link } from "@/lib/wouter";

// Foto putaran 360°: 8 sudut (0°, 45°, …, 315°) rompi yang dipakai manekin.
const lapanganFrames = Object.values(
  import.meta.glob<string>("/src/assets/rompi-putar-lapangan-*.webp", { eager: true, import: "default" }),
);
const nempoFrames = Object.values(
  import.meta.glob<string>("/src/assets/rompi-putar-nempo-*.webp", { eager: true, import: "default" }),
);

const products = [
  {
    name: "Rompi Lapangan Nempo",
    frames: lapanganFrames,
    desc: "Rompi crew lapangan dengan webbing modular di depan, aksen gradasi biru-ungu Kala Muda dan strip reflektif. Semua alat penting di lapangan punya tempatnya sendiri.",
    features: [
      "Holster HT di dada + kantong HP",
      "Slot pulpen/spidol, gantungan lakban dan D-ring karabiner",
      "Kantong kargo besar + kantong botol jaring di samping",
      "Webbing modular di depan, punggung polos dengan logo besar",
      "Strip reflektif buat kerja malam",
    ],
  },
  {
    name: "Rompi Nempo",
    frames: nempoFrames,
    desc: "Rompi utility warna navy dengan aksen gradasi biru-ungu khas Kala Muda, logo nempo di dada dan lambang \"n\" besar di punggung, ditemani logo kecil KALA MUDA.",
    features: ["Kantong depan + saku ritsleting", "Strap samping bisa disesuaikan", "Lapisan dalam jaring, adem dipakai"],
  },
];

const SECONDS_PER_ANGLE = 0.5;
// Kemiringan foto (derajat) di antara dua sudut foto yang berjarak 45°.
const SWING = 14;
const LABELS = ["depan", "serong kiri", "samping kiri", "serong belakang", "belakang", "serong belakang", "samping kanan", "serong kanan"];

function VestSpinner({ frames, name }: { frames: string[]; name: string }) {
  const [paused, setPaused] = useState(false);
  const imgs = useRef<(HTMLImageElement | null)[]>([]);
  const pos = useRef(0);
  const dragging = useRef<{ x: number; start: number; moved: boolean } | null>(null);

  useEffect(() => {
    const n = frames.length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    let visible = true;
    let ready = false;
    let alive = true;
    const render = () => {
      const p = ((pos.current % n) + n) % n;
      const a = Math.floor(p) % n;
      const f = p - Math.floor(p);
      // Hanya satu foto yang tampil (tanpa memudar), jadi tidak ada bayangan dobel.
      // Di antara dua sudut, foto itu sendiri ikut berputar searah putaran rompi
      // (dari +SWING ke -SWING), lalu langsung berganti ke sudut berikutnya
      // sehingga gerakannya terasa seperti benar-benar berputar.
      const rot = `perspective(1400px) rotateY(${(SWING * (1 - 2 * f)).toFixed(2)}deg)`;
      imgs.current.forEach((el, i) => {
        if (!el) return;
        const show = i === a;
        const o = show ? "1" : "0";
        if (el.style.opacity !== o) el.style.opacity = o;
        if (show) el.style.transform = rot;
      });
    };
    const tick = (now: number) => {
      // Batasi lompatan waktu (mis. setelah pindah tab) supaya tidak meloncat.
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (ready && !paused && !reduce && !dragging.current) pos.current += dt / SECONDS_PER_ANGLE;
      render();
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    const start = () => {
      if (raf || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    // Siapkan semua foto dulu supaya putaran pertama tidak tersendat.
    Promise.all(imgs.current.map((el) => el?.decode?.().catch(() => undefined))).then(() => {
      ready = true;
    });
    const scene = imgs.current[0]?.closest(".merch-scene");
    const io =
      scene && "IntersectionObserver" in window
        ? new IntersectionObserver(([entry]) => {
            visible = !!entry?.isIntersecting;
            if (visible) start();
          })
        : null;
    if (io && scene) io.observe(scene);
    start();
    return () => {
      alive = false;
      io?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [frames.length, paused]);

  return (
    <div className="merch-scene relative flex flex-col items-center overflow-hidden px-6 pb-6 pt-10">
      <span aria-hidden className="merch-glow" />
      <button
        type="button"
        className="merch-stage"
        aria-label={paused ? `Putar lagi ${name}` : `Hentikan putaran ${name}`}
        onPointerDown={(e) => {
          dragging.current = { x: e.clientX, start: pos.current, moved: false };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const g = dragging.current;
          if (!g) return;
          const dx = e.clientX - g.x;
          if (Math.abs(dx) > 4) g.moved = true;
          pos.current = g.start - dx / 45;
        }}
        onPointerUp={() => {
          const g = dragging.current;
          dragging.current = null;
          if (g && !g.moved) setPaused((v) => !v);
        }}
        onPointerCancel={() => {
          dragging.current = null;
        }}
      >
        <div className={`merch-float ${paused ? "is-paused" : ""}`}>
          {frames.map((src, i) => (
            <img
              key={src}
              ref={(el) => {
                imgs.current[i] = el;
              }}
              src={src}
              alt={`${name} tampak ${LABELS[i] ?? ""}`}
              draggable={false}
              className="merch-face"
              style={{ opacity: i === 0 ? 1 : 0 }}
            />
          ))}
        </div>
        <span aria-hidden className="merch-shadow" />
      </button>
      <p className="relative mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c7cdf5]">
        360° · {paused ? "Ketuk untuk memutar" : "Ketuk untuk berhenti"} · Geser untuk memutar
      </p>
    </div>
  );
}

export default function MerchandisePage() {
  return (
    <Layout>
      <SEO title="Merchandise Komunitas Kala Muda" noIndex />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <span className="inline-flex rounded-full border border-[#a62f78]/25 bg-[#fce7f3] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#a62f78]">
          Merchandise Komunitas
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-[#182b39] sm:text-4xl">
          Merch resmi Kala Muda × Nempo
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#5f6b6f] sm:text-base">
          Pakai bareng anggota dan pendukung komunitas — di event, kegiatan, atau nongkrong sehari-hari.
        </p>

        {products.map((p) => (
        <article key={p.name} className="mt-8 overflow-hidden rounded-3xl border border-[#dce4fb] bg-white shadow-sm md:grid md:grid-cols-[1fr_1fr] md:items-stretch">
          <VestSpinner frames={p.frames} name={p.name} />
          <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
            <span className="w-fit rounded-full bg-[#182b39] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">Segera hadir</span>
            <h2 className="text-2xl font-black text-[#182b39]">{p.name}</h2>
            <p className="text-sm leading-6 text-[#5f6b6f]">{p.desc}</p>
            <ul className="space-y-1.5 text-sm text-[#182b39]">
              {p.features.map((f) => <li key={f}>• {f}</li>)}
            </ul>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <Link href="/komunitas" className="inline-flex justify-center rounded-full bg-[#a62f78] px-5 py-3 text-sm font-bold text-white hover:bg-[#862761]">
                Gabung Komunitas
              </Link>
              <Link href="/recruitment" className="inline-flex justify-center rounded-full border border-[#c8c8e7] px-5 py-3 text-sm font-bold text-[#49346e] hover:border-[#a62f78]/50">
                Daftar Recruitment
              </Link>
            </div>
          </div>
        </article>
        ))}
      </section>
      <style>{`
        .merch-scene { background: radial-gradient(120% 90% at 50% 20%, #2b2f8f 0%, #1a1c55 45%, #0f1030 100%); align-self: stretch; justify-content: center; }
        .merch-glow { position: absolute; top: 18%; left: 50%; width: 70%; aspect-ratio: 1; transform: translateX(-50%); border-radius: 50%; background: radial-gradient(circle, rgba(110,75,180,.55), rgba(37,99,235,.25) 45%, transparent 70%); filter: blur(10px); animation: merch-pulse 4s ease-in-out infinite; }
        .merch-stage { width: min(70vw, 300px); aspect-ratio: 3 / 4; position: relative; cursor: grab; background: none; border: 0; padding: 0; touch-action: pan-y; user-select: none; }
        .merch-stage:active { cursor: grabbing; }
        .merch-float { position: absolute; inset: 0; animation: merch-float 4s ease-in-out infinite; }
        .merch-float.is-paused, .merch-scene:has(.is-paused) .merch-shadow { animation-play-state: paused; }
        .merch-face { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; pointer-events: none; will-change: transform; backface-visibility: hidden; }
        .merch-shadow { position: absolute; left: 22%; right: 22%; bottom: 2%; height: 16px; border-radius: 50%; background: rgba(0,0,0,.55); filter: blur(8px); animation: merch-shadow 4s ease-in-out infinite; }
        @keyframes merch-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes merch-shadow { 0%,100% { transform: scaleX(1); opacity: .9; } 50% { transform: scaleX(.8); opacity: .55; } }
        @keyframes merch-pulse { 0%,100% { opacity: .8; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .merch-float, .merch-shadow, .merch-glow { animation: none; } }
      `}</style>
    </Layout>
  );
}
