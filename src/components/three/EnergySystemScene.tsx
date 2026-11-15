"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Info } from "lucide-react";
import type * as THREE from "three";
import SystemDiagram, { DIAGRAM_NOTE, diagramIconFor, diagramKindFor } from "@/components/SystemDiagram";
import type { Locale } from "@/data";

/**
 * EnergySystemScene — the ONE selective 3D scene (v15 §10.6, Scene B:
 * isometric energy system). Vanilla Three.js (no React Three Fiber — see
 * docs/3d-and-illustration-plan.md for the decision record).
 *
 * Same props as SystemDiagram, so the coordinator wires it with a one-line
 * swap in the pumping solution detail diagram section. The SVG diagram
 * IS the fallback and is rendered by default:
 * - SSR / JS disabled → SVG diagram (static export serves it).
 * - `prefers-reduced-motion` → SVG diagram, no canvas, no loop.
 * - WebGL unavailable / context creation fails / three import fails →
 *   SVG diagram.
 * - Canvas mode → the 3D scene + an HTML legend (icons + labels, in node
 *   order) + the illustrative note. Critical text is HTML, never in canvas.
 *
 * Performance (v15 §10.6 rules): three is dynamically imported (its chunk
 * loads only on the client, after mount, never in the initial bundle);
 * rendering pauses when the scene is off-screen (IntersectionObserver)
 * and when the tab is hidden (visibilitychange); DPR is capped (1.5 on
 * coarse pointers, 2 otherwise); no shadows, no post-processing, flat
 * Lambert materials, one small scene; everything is disposed on unmount.
 *
 * The scene is explicitly ILLUSTRATIVE: generic object types per node
 * kind (panels / device / pump / tank / battery / house) from
 * `diagramKindFor` — never the internal design of a real branded product,
 * no invented engineering data.
 */
export default function EnergySystemScene({
  locale,
  nodes,
  caption,
}: {
  locale: Locale;
  nodes: { label: string; icon: string }[];
  caption?: string;
}) {
  const dir = locale === "ar" ? "rtl" : "ltr";
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<"fallback" | "canvas">("fallback");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof window.WebGLRenderingContext === "undefined") return;

    let disposed = false;
    let stopLoop: (() => void) | null = null;
    let cleanup: (() => void) | null = null;

    (async () => {
      try {
        const three = await import("three");
        if (disposed || !hostRef.current) return;

        const coarse = window.matchMedia("(pointer: coarse)").matches;
        const renderer = new three.WebGLRenderer({ antialias: true, powerPreference: "low-power" });
        if (!renderer.getContext()) throw new Error("WebGL context unavailable");
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2));
        renderer.setClearColor(0xeaf3fc, 1);
        host.appendChild(renderer.domElement);
        renderer.domElement.setAttribute("aria-hidden", "true");
        renderer.domElement.style.display = "block";
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";

        const scene = new three.Scene();
        const HALF_H = 4.0;
        const camera = new three.OrthographicCamera(-HALF_H, HALF_H, HALF_H, -HALF_H, 0.1, 100);
        camera.position.set(11, 10, 11);
        camera.lookAt(0, 0.6, 0);

        scene.add(new three.HemisphereLight(0xffffff, 0xb2d3f0, 1.15));
        const dirLight = new three.DirectionalLight(0xffffff, 1.25);
        dirLight.position.set(6, 12, 4);
        scene.add(dirLight);

        const world = new three.Group();
        scene.add(world);

        const n = nodes.length;
        const SPACING = 3.2;
        const xs = nodes.map((_, i) => (i - (n - 1) / 2) * SPACING);
        const span = (n - 1) * SPACING;

        // Ground.
        const ground = new three.Mesh(
          new three.PlaneGeometry(span + 5, 7),
          new three.MeshLambertMaterial({ color: 0xd9edfb }),
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        world.add(ground);

        const edge = (geo: THREE.BufferGeometry, color = 0x6b7280) =>
          new three.LineSegments(new three.EdgesGeometry(geo), new three.LineBasicMaterial({ color }));

        const shadow = (x: number, r: number) => {
          const s = new three.Mesh(
            new three.CircleGeometry(r, 24),
            new three.MeshBasicMaterial({ color: 0x102b46, transparent: true, opacity: 0.08 }),
          );
          s.rotation.x = -Math.PI / 2;
          s.position.set(x, 0.01, 0);
          world.add(s);
        };

        const buildPanels = (x: number) => {
          const g = new three.Group();
          const legGeo = new three.BoxGeometry(0.12, 0.9, 0.12);
          const legMat = new three.MeshLambertMaterial({ color: 0x6b7280 });
          [-0.8, 0.8].forEach((dx) => {
            const leg = new three.Mesh(legGeo, legMat);
            leg.position.set(dx, 0.45, 0);
            g.add(leg);
          });
          const slabGeo = new three.BoxGeometry(2.3, 0.1, 1.5);
          const slab = new three.Mesh(slabGeo, new three.MeshLambertMaterial({ color: 0x102b46 }));
          slab.position.y = 1.0;
          slab.rotation.x = -0.42;
          g.add(slab);
          const slabEdges = edge(slabGeo, 0x89e9f8);
          slabEdges.position.copy(slab.position);
          slabEdges.rotation.copy(slab.rotation);
          g.add(slabEdges);
          g.position.x = x;
          world.add(g);
          shadow(x, 1.3);
        };

        const buildDevice = (x: number) => {
          const g = new three.Group();
          const bodyGeo = new three.BoxGeometry(1.1, 1.5, 0.55);
          const body = new three.Mesh(bodyGeo, new three.MeshLambertMaterial({ color: 0xffffff }));
          body.position.y = 0.75;
          g.add(body);
          const bodyEdges = edge(bodyGeo, 0x6b7280);
          bodyEdges.position.copy(body.position);
          g.add(bodyEdges);
          const screen = new three.Mesh(
            new three.PlaneGeometry(0.55, 0.35),
            new three.MeshBasicMaterial({ color: 0x102b46 }),
          );
          screen.position.set(0, 1.05, 0.28);
          g.add(screen);
          const dot = new three.Mesh(
            new three.CircleGeometry(0.06, 16),
            new three.MeshBasicMaterial({ color: 0x108981 }),
          );
          dot.position.set(0.32, 0.62, 0.28);
          g.add(dot);
          g.position.x = x;
          world.add(g);
          shadow(x, 0.9);
        };

        const buildPump = (x: number) => {
          const g = new three.Group();
          const bodyGeo = new three.CylinderGeometry(0.45, 0.45, 1.1, 24);
          const body = new three.Mesh(bodyGeo, new three.MeshLambertMaterial({ color: 0x0b70c9 }));
          body.position.y = 0.55;
          g.add(body);
          const cap = new three.Mesh(
            new three.CylinderGeometry(0.5, 0.5, 0.12, 24),
            new three.MeshLambertMaterial({ color: 0x102b46 }),
          );
          cap.position.y = 1.16;
          g.add(cap);
          const pipe = new three.Mesh(
            new three.CylinderGeometry(0.12, 0.12, 0.7, 12),
            new three.MeshLambertMaterial({ color: 0x6b7280 }),
          );
          pipe.position.y = 1.5;
          g.add(pipe);
          g.position.x = x;
          world.add(g);
          shadow(x, 0.8);
        };

        const buildTank = (x: number) => {
          const g = new three.Group();
          const bodyGeo = new three.CylinderGeometry(0.8, 0.8, 1.6, 28);
          const body = new three.Mesh(bodyGeo, new three.MeshLambertMaterial({ color: 0xffffff }));
          body.position.y = 0.8;
          g.add(body);
          const bodyEdges = edge(bodyGeo, 0x6b7280);
          bodyEdges.position.copy(body.position);
          g.add(bodyEdges);
          const band = new three.Mesh(
            new three.CylinderGeometry(0.82, 0.82, 0.14, 28),
            new three.MeshLambertMaterial({ color: 0x1e8fe8 }),
          );
          band.position.y = 0.8;
          g.add(band);
          const roof = new three.Mesh(
            new three.ConeGeometry(0.8, 0.45, 28),
            new three.MeshLambertMaterial({ color: 0xb2d3f0 }),
          );
          roof.position.y = 1.82;
          g.add(roof);
          g.position.x = x;
          world.add(g);
          shadow(x, 1.1);
        };

        const buildBattery = (x: number) => {
          const g = new three.Group();
          const bodyGeo = new three.BoxGeometry(1.0, 1.3, 0.7);
          const body = new three.Mesh(bodyGeo, new three.MeshLambertMaterial({ color: 0x102b46 }));
          body.position.y = 0.65;
          g.add(body);
          const bodyEdges = edge(bodyGeo, 0x89e9f8);
          bodyEdges.position.copy(body.position);
          g.add(bodyEdges);
          [-0.25, 0, 0.25].forEach((dx) => {
            const bar = new three.Mesh(
              new three.PlaneGeometry(0.16, 0.5),
              new three.MeshBasicMaterial({ color: 0x89e9f8 }),
            );
            bar.position.set(dx, 0.65, 0.36);
            g.add(bar);
          });
          g.position.x = x;
          world.add(g);
          shadow(x, 0.9);
        };

        const buildHouse = (x: number) => {
          const g = new three.Group();
          const bodyGeo = new three.BoxGeometry(1.5, 1.1, 1.3);
          const body = new three.Mesh(bodyGeo, new three.MeshLambertMaterial({ color: 0xffffff }));
          body.position.y = 0.55;
          g.add(body);
          const bodyEdges = edge(bodyGeo, 0x6b7280);
          bodyEdges.position.copy(body.position);
          g.add(bodyEdges);
          const roof = new three.Mesh(
            new three.ConeGeometry(1.35, 0.7, 4),
            new three.MeshLambertMaterial({ color: 0x0b70c9 }),
          );
          roof.rotation.y = Math.PI / 4;
          roof.position.y = 1.45;
          g.add(roof);
          const window_ = new three.Mesh(
            new three.PlaneGeometry(0.35, 0.45),
            new three.MeshBasicMaterial({ color: 0xf5b942 }),
          );
          window_.position.set(0.3, 0.55, 0.66);
          g.add(window_);
          g.position.x = x;
          world.add(g);
          shadow(x, 1.1);
        };

        const builders = {
          panels: buildPanels,
          device: buildDevice,
          pump: buildPump,
          tank: buildTank,
          battery: buildBattery,
          house: buildHouse,
        } as const;
        nodes.forEach((node, i) => {
          builders[diagramKindFor(node.icon)](xs[i]);
        });

        // Energy flow: tube along the node tops + moving dots.
        let curve: THREE.CatmullRomCurve3 | null = null;
        let dots: THREE.Mesh[] = [];
        if (n >= 2) {
          curve = new three.CatmullRomCurve3(xs.map((x) => new three.Vector3(x, 2.1, 0)));
          const tube = new three.Mesh(
            new three.TubeGeometry(curve, 64, 0.03, 8, false),
            new three.MeshBasicMaterial({ color: 0x1e8fe8, transparent: true, opacity: 0.55 }),
          );
          world.add(tube);
          const dotGeo = new three.SphereGeometry(0.09, 16, 12);
          const dotMat = new three.MeshBasicMaterial({ color: 0x0081fb });
          dots = [0, 1 / 3, 2 / 3].map((phase) => {
            const d = new three.Mesh(dotGeo, dotMat);
            d.userData.phase = phase;
            world.add(d);
            return d;
          });
        }

        const resize = () => {
          const el = hostRef.current;
          if (!el) return;
          const w = el.clientWidth;
          const h = el.clientHeight;
          if (w === 0 || h === 0) return;
          const aspect = w / h;
          camera.left = -HALF_H * aspect;
          camera.right = HALF_H * aspect;
          camera.top = HALF_H;
          camera.bottom = -HALF_H;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
        };
        resize();

        const clock = new three.Clock();
        let running = false;
        const start = () => {
          if (running || disposed) return;
          running = true;
          renderer.setAnimationLoop(() => {
            const t = clock.getElapsedTime();
            if (curve) {
              dots.forEach((d) => {
                const u = (t * 0.08 + (d.userData.phase as number)) % 1;
                d.position.copy(curve!.getPointAt(u));
              });
            }
            renderer.render(scene, camera);
          });
        };
        const stop = () => {
          if (!running) return;
          running = false;
          renderer.setAnimationLoop(null);
        };
        stopLoop = stop;

        let inView = false;
        const maybeStart = () => {
          if (inView && !document.hidden) start();
          else stop();
        };
        const io = new IntersectionObserver(
          (entries) => {
            inView = entries[0]?.isIntersecting ?? false;
            maybeStart();
          },
          { threshold: 0.05 },
        );
        io.observe(host);
        const onVisibility = () => maybeStart();
        document.addEventListener("visibilitychange", onVisibility);
        const ro = new ResizeObserver(() => {
          resize();
          renderer.render(scene, camera);
        });
        ro.observe(host);
        // First paint even before the observer fires.
        renderer.render(scene, camera);
        maybeStart();

        cleanup = () => {
          stop();
          io.disconnect();
          ro.disconnect();
          document.removeEventListener("visibilitychange", onVisibility);
          scene.traverse((obj) => {
            const o = obj as unknown as {
              geometry?: THREE.BufferGeometry;
              material?: THREE.Material | THREE.Material[];
            };
            o.geometry?.dispose();
            if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
            else o.material?.dispose();
          });
          renderer.dispose();
          if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
        };

        if (!disposed) setMode("canvas");
      } catch {
        // Any failure (import, WebGL, build) → stay on the SVG fallback.
        // Nothing throws to the page; the diagram is still fully usable.
      }
    })();

    return () => {
      disposed = true;
      stopLoop?.();
      cleanup?.();
    };
    // nodes are static per route (data-driven, never change in place).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <figure className="overflow-hidden rounded-card border border-border bg-surface p-4" dir={dir}>
      {/* Canvas host is always in the DOM (empty + hidden in fallback mode)
          so the effect can mount the renderer into it. */}
      <div
        ref={hostRef}
        aria-hidden="true"
        className={mode === "canvas" ? "relative aspect-[16/10] w-full overflow-hidden rounded-[0.625rem]" : "hidden"}
      />
      {mode === "fallback" && <SystemDiagram locale={locale} nodes={nodes} caption={caption} />}
      {mode === "canvas" && (
        <>
          {/* HTML legend: the critical text lives here, not in the canvas. */}
          <ol className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
            {nodes.map((node, i) => {
              const Icon = diagramIconFor(node.icon);
              return (
                <li key={i} className="flex items-center gap-2">
                  {i > 0 && <ArrowLeft className="size-4 shrink-0 text-text-muted rtl:rotate-0 ltr:rotate-180" aria-hidden="true" />}
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sky px-3 py-1.5 text-sm font-semibold text-navy">
                    <Icon className="size-4 shrink-0 text-primary-hover" aria-hidden="true" />
                    {node.label}
                  </span>
                </li>
              );
            })}
          </ol>
          {caption && <figcaption className="mt-3 text-center text-caption text-text-muted">{caption}</figcaption>}
          <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-caption text-text-muted">
            <Info className="size-4 shrink-0 text-primary-hover" aria-hidden="true" />
            <span>{DIAGRAM_NOTE[locale]}</span>
          </p>
        </>
      )}
    </figure>
  );
}
