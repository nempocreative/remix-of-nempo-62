# Rules for `src/apps/`

- Other Replit artifacts live in `src/apps/<key>/` (own `@/apps/<key>/` imports, `entry.tsx`, public files under `public/<base>/`) and mount at `/<base>` via `src/routes/<base>.index.tsx` + `<base>.$.tsx` using `AppShell`; why: each was a separate Vite app and they must not collide.
- GGS slide 12 uses `GgsWeAreOpenSlide`, scoped `ggo-` styles, welcoming image-to-video footage, original header/footer and pause/replay controls; its MP4 captures video seeks and CSS time steps from the same artboard, so download and preview match without modifying slide 11.
