import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/merchandise")({
  head: () => ({
    meta: [
      { title: "Merchandise Nempo × Kala Muda — PDH, Rompi & Gelang" },
      { name: "description", content: "Koleksi konsep kemeja PDH dan rompi Nempo × Kala Muda dengan tampilan dari berbagai sudut." },
      { property: "og:title", content: "Merchandise Nempo × Kala Muda — PDH, Rompi & Gelang" },
      { property: "og:description", content: "Lihat desain kemeja PDH navy dan rompi komunitas Nempo × Kala Muda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NempoShell,
});