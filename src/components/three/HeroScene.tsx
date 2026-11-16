"use client";

import { useEffect, useRef } from "react";
import type * as THREE from "three";

/**
 * HeroScene — ambient procedural Three.js background for the home hero
 * (Phase 1, plan §7 WebGL Backgrounds). Vanilla Three.js, following the
 * `EnergySystemScene.tsx` pattern exactly:
 *
 * - `three` is dynamically imported (never in the initial bundle).
 * - No external model files: panels / inverter / battery / house are all
 *   built from primitives in code — generic object types only, never the
 *   internal design of a real branded product.
 * - `prefers-reduced-motion` → no canvas at all (the gate in
 *   `HeroAmbient` already excludes it; this is a second guard).
 * - DPR capped (1.5 on coarse pointers, 2 otherwise); no shadows, no
 *   post-processing, flat Lambert materials, one small scene.
 * - The render loop pauses when the hero is off-screen
 *   (IntersectionObserver) and when the tab is hidden
 *   (visibilitychange); everything is disposed on unmount.
 * - The canvas is purely decorative (`aria-hidden`): all copy, CTAs and
 *   stat pills stay real HTML above it, and the villa photo panel is
 *   untouched.
 *
 * Behaviour: energy-flow dots travel along a curve over the objects;
 * the whole scene drifts gently toward the pointer (parallax, refs only
 * — never setState in the loop) and fades out (opacity only) as the hero
 * scrolls away.
 */
export default function HeroScene() {
  const hostRef = useRef<HTMLDivElement | null>(null);

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
        const renderer = new three.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
        if (!renderer.getContext()) throw new Error("WebGL context unavailable");
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2));
        renderer.setClearColor(0x000000, 0);
        host.appendChild(renderer.domElement);
        renderer.domElement.setAttribute("aria-hidden", "true");
        renderer.domElement.style.display = "block";
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.opacity = "0.55";

        const scene = new three.Scene();
        const camera = new three.PerspectiveCamera(40, 1, 0.1, 100);
        camera.position.set(0, 3.4, 10.5);
        camera.lookAt(0, 0.9, 0);

        scene.add(new three.HemisphereLight(0xffffff, 0x16324f, 1.2));
        const dirLight = new three.DirectionalLight(0xffffff, 1.1);
        dirLight.position.set(6, 12, 4);
        scene.add(dirLight);

        const world = new three.Group();
        // Ambient scale/placement: the hero is a two-column layout (copy
        // right, photo panel left) with no empty middle band, so the scene
        // is small, low and shifted left — a faint backdrop, never a
        // foreground diorama competing with the headline.
        world.scale.setScalar(0.62);
        world.position.set(-0.8, -0.9, 0);
        scene.add(world);

        const edge = (geo: THREE.BufferGeometry, color = 0x8be5f8) =>
          new three.LineSegments(new three.EdgesGeometry(geo), new three.LineBasicMaterial({ color }));

        // Ground — a faint navy plane so the objects sit on something.
        const ground = new three.Mesh(
          new three.PlaneGeometry(24, 8),
          new three.MeshLambertMaterial({ color: 0x16324f, transparent: true, opacity: 0.45 }),
        );
        ground.rotation.x = -Math.PI / 2;
        world.add(ground);

        const shadow = (x: number, r: number) => {
          const s = new three.Mesh(
            new three.CircleGeometry(r, 24),
            new three.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18 }),
          );
          s.rotation.x = -Math.PI / 2;
          s.position.set(x, 0.01, 0);
          world.add(s);
        };

        // Solar panel (tilted slab on legs, navy + cyan edges).
        const buildPanels = (x: number) => {
          const g = new three.Group();
          const legMat = new three.MeshLambertMaterial({ color: 0x6b7280 });
          [-0.8, 0.8].forEach((dx) => {
            const leg = new three.Mesh(new three.BoxGeometry(0.12, 0.9, 0.12), legMat);
            leg.position.set(dx, 0.45, 0);
            g.add(leg);
          });
          const slabGeo = new three.BoxGeometry(2.3, 0.1, 1.5);
          const slab = new three.Mesh(slabGeo, new three.MeshLambertMaterial({ color: 0x102b46 }));
          slab.position.y = 1.0;
          slab.rotation.x = -0.42;
          g.add(slab);
          const slabEdges = edge(slabGeo);
          slabEdges.position.copy(slab.position);
          slabEdges.rotation.copy(slab.rotation);
          g.add(slabEdges);
          g.position.x = x;
          world.add(g);
          shadow(x, 1.3);
        };

        // Inverter (white box + navy screen + green status dot).
        const buildInverter = (x: number) => {
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
            new three.MeshBasicMaterial({ color: 0x10b981 }),
          );
          dot.position.set(0.32, 0.62, 0.28);
          g.add(dot);
          g.position.x = x;
          world.add(g);
          shadow(x, 0.9);
        };

        // Battery (navy box + cyan charge bars).
        const buildBattery = (x: number) => {
          const g = new three.Group();
          const bodyGeo = new three.BoxGeometry(1.0, 1.3, 0.7);
          const body = new three.Mesh(bodyGeo, new three.MeshLambertMaterial({ color: 0x102b46 }));
          body.position.y = 0.65;
          g.add(body);
          const bodyEdges = edge(bodyGeo);
          bodyEdges.position.copy(body.position);
          g.add(bodyEdges);
          [-0.25, 0, 0.25].forEach((dx) => {
            const bar = new three.Mesh(
              new three.PlaneGeometry(0.16, 0.5),
              new three.MeshBasicMaterial({ color: 0x8be5f8 }),
            );
            bar.position.set(dx, 0.65, 0.36);
            g.add(bar);
          });
          g.position.x = x;
          world.add(g);
          shadow(x, 0.9);
        };

        // House (white box + blue pyramid roof + warm window).
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

        buildPanels(-3.4);
        buildInverter(-1.1);
        buildBattery(1.1);
        buildHouse(3.4);

        // Energy flow: tube along the object tops + travelling dots.
        const xs = [-3.4, -1.1, 1.1, 3.4];
        const curve = new three.CatmullRomCurve3(xs.map((x) => new three.Vector3(x, 2.1, 0)));
        const tube = new three.Mesh(
          new three.TubeGeometry(curve, 64, 0.03, 8, false),
          new three.MeshBasicMaterial({ color: 0x1e8fe8, transparent: true, opacity: 0.35 }),
        );
        world.add(tube);
        const dotGeo = new three.SphereGeometry(0.09, 16, 12);
        const dotColors = [0x0081fb, 0x8be5f8, 0xe31e24];
        const dots = [0, 1 / 3, 2 / 3].map((phase, i) => {
          const d = new three.Mesh(
            dotGeo,
            new three.MeshBasicMaterial({ color: dotColors[i % dotColors.length] }),
          );
          d.userData.phase = phase;
          world.add(d);
          return d;
        });

        const resize = () => {
          const el = hostRef.current;
          if (!el) return;
          const w = el.clientWidth;
          const h = el.clientHeight;
          if (w === 0 || h === 0) return;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
        };
        resize();

        // Gentle pointer parallax (refs only — no React state in the loop).
        const target = { x: 0, y: 0 };
        const onPointerMove = (e: PointerEvent) => {
          target.x = (e.clientX / window.innerWidth - 0.5) * 0.18;
          target.y = (e.clientY / window.innerHeight - 0.5) * -0.08;
        };
        window.addEventListener("pointermove", onPointerMove, { passive: true });

        const clock = new three.Clock();
        let running = false;
        const start = () => {
          if (running || disposed) return;
          running = true;
          renderer.setAnimationLoop(() => {
            const t = clock.getElapsedTime();
            dots.forEach((d) => {
              const u = (t * 0.06 + (d.userData.phase as number)) % 1;
              d.position.copy(curve.getPointAt(u));
            });
            // Ease the world toward the pointer target.
            world.rotation.y += (target.x - world.rotation.y) * 0.04;
            world.rotation.x += (target.y - world.rotation.x) * 0.04;
            // Scroll fade (opacity only): the hero fades as it scrolls away.
            const rect = host.getBoundingClientRect();
            const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
            renderer.domElement.style.opacity = String(0.55 * (1 - progress * 0.85));
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
        renderer.render(scene, camera);
        maybeStart();

        cleanup = () => {
          stop();
          io.disconnect();
          ro.disconnect();
          document.removeEventListener("visibilitychange", onVisibility);
          window.removeEventListener("pointermove", onPointerMove);
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
      } catch {
        // Any failure (import, WebGL, build) → no canvas. The hero is
        // fully usable without it: mesh background + photo + copy stay.
      }
    })();

    return () => {
      disposed = true;
      stopLoop?.();
      cleanup?.();
    };
  }, []);

  return <div ref={hostRef} aria-hidden="true" className="absolute inset-0" />;
}
