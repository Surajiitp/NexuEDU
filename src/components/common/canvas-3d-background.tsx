"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Box, Orbit, Sparkles, Layers, ChevronUp, ChevronDown, RefreshCw } from "lucide-react";

export type Background3DMode = "cyber" | "cosmic" | "quantum";

export interface Canvas3DBackgroundProps {
  className?: string;
  initialMode?: Background3DMode;
  showHud?: boolean;
}

interface Node3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  baseColor: string;
  pulsePhase: number;
}

interface Ring3D {
  radius: number;
  tiltX: number;
  tiltY: number;
  rotSpeed: number;
  angle: number;
  segments: number;
  color: string;
  satelliteAngle: number;
  satelliteSpeed: number;
  satelliteTrail: { x: number; y: number; alpha: number }[];
}

interface Polyhedron3D {
  center: { x: number; y: number; z: number };
  baseCenter: { x: number; y: number; z: number };
  rotX: number;
  rotY: number;
  rotZ: number;
  speedX: number;
  speedY: number;
  speedZ: number;
  scale: number;
  vertices: [number, number, number][];
  faces: number[][];
  colorScheme: {
    stroke: string;
    fillBase: [number, number, number];
    glow: string;
  };
}

interface Shockwave3D {
  x: number;
  y: number;
  z: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

export default function Canvas3DBackground({
  className = "",
  initialMode = "cyber",
  showHud = true,
}: Canvas3DBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // User interactive feature toggles
  const [mode, setMode] = useState<Background3DMode>(initialMode);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showPolyhedra, setShowPolyhedra] = useState<boolean>(true);
  const [showRings, setShowRings] = useState<boolean>(true);
  const [hudExpanded, setHudExpanded] = useState<boolean>(false);

  // Mouse & physics tracking refs (avoids re-rendering canvas loop)
  const stateRef = useRef({
    mode: initialMode,
    showGrid: true,
    showPolyhedra: true,
    showRings: true,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    camX: 0,
    camY: 0,
    camRotX: 0,
    camRotY: 0,
    time: 0,
    gridOffsetZ: 0,
    shockwaves: [] as Shockwave3D[],
  });

  // Sync state ref with React states
  useEffect(() => {
    stateRef.current.mode = mode;
    stateRef.current.showGrid = showGrid;
    stateRef.current.showPolyhedra = showPolyhedra;
    stateRef.current.showRings = showRings;
  }, [mode, showGrid, showPolyhedra, showRings]);

  // Click shockwave trigger
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left - rect.width / 2;
    const clickY = e.clientY - rect.top - rect.height / 2;

    stateRef.current.shockwaves.push({
      x: clickX,
      y: clickY,
      z: 300,
      radius: 10,
      maxRadius: 450,
      alpha: 0.85,
      speed: 12,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      stateRef.current.targetMouseX = nx * 0.45;
      stateRef.current.targetMouseY = ny * 0.4;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Color palettes by mode
    const getPalettes = (currentMode: Background3DMode) => {
      switch (currentMode) {
        case "quantum":
          return {
            nodes: [
              "rgba(52, 211, 153, 0.85)", // emerald-400
              "rgba(16, 185, 129, 0.8)",  // emerald-500
              "rgba(163, 230, 53, 0.8)",  // lime-400
              "rgba(20, 184, 166, 0.75)", // teal-500
              "rgba(34, 211, 238, 0.7)",  // cyan-400
            ],
            rings: [
              "rgba(52, 211, 153, 0.4)",
              "rgba(163, 230, 53, 0.35)",
              "rgba(20, 184, 166, 0.3)",
            ],
            grid: "rgba(52, 211, 153, 0.25)",
            satellite: "rgba(163, 230, 53, 1)",
          };
        case "cosmic":
          return {
            nodes: [
              "rgba(168, 85, 247, 0.85)", // purple-500
              "rgba(192, 132, 252, 0.8)", // purple-400
              "rgba(99, 102, 241, 0.8)",  // indigo-500
              "rgba(236, 72, 153, 0.75)", // pink-500
              "rgba(56, 189, 248, 0.7)",  // sky-400
            ],
            rings: [
              "rgba(168, 85, 247, 0.4)",
              "rgba(99, 102, 241, 0.35)",
              "rgba(236, 72, 153, 0.3)",
            ],
            grid: "rgba(168, 85, 247, 0.25)",
            satellite: "rgba(244, 114, 182, 1)",
          };
        case "cyber":
        default:
          return {
            nodes: [
              "rgba(34, 211, 238, 0.85)", // cyan-400
              "rgba(56, 189, 248, 0.8)",  // sky-400
              "rgba(52, 211, 153, 0.8)",  // emerald-400
              "rgba(168, 85, 247, 0.7)",  // purple-500
              "rgba(45, 212, 191, 0.8)",  // teal-400
            ],
            rings: [
              "rgba(34, 211, 238, 0.4)",
              "rgba(52, 211, 153, 0.35)",
              "rgba(168, 85, 247, 0.28)",
            ],
            grid: "rgba(34, 211, 238, 0.28)",
            satellite: "rgba(34, 211, 238, 1)",
          };
      }
    };

    // 1. Constellation swarm particles (3D volume)
    const nodeCount = 60;
    const nodes: Node3D[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const rad = 180 + Math.random() * 380;
      nodes.push({
        x: rad * Math.sin(phi) * Math.cos(theta),
        y: rad * Math.sin(phi) * Math.sin(theta),
        z: rad * Math.cos(phi),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.5 + 1.2,
        baseColor: "rgba(34, 211, 238, 0.8)",
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // 2. Multi-Axis 3D Gyroscopic Rings with Satellites
    const rings: Ring3D[] = [
      {
        radius: 230,
        tiltX: 0.65,
        tiltY: 0.3,
        rotSpeed: 0.007,
        angle: 0,
        segments: 40,
        color: "rgba(34, 211, 238, 0.35)",
        satelliteAngle: 0,
        satelliteSpeed: 0.024,
        satelliteTrail: [],
      },
      {
        radius: 330,
        tiltX: -0.55,
        tiltY: 0.75,
        rotSpeed: -0.0055,
        angle: Math.PI / 3,
        segments: 48,
        color: "rgba(52, 211, 153, 0.3)",
        satelliteAngle: Math.PI,
        satelliteSpeed: -0.018,
        satelliteTrail: [],
      },
      {
        radius: 430,
        tiltX: 0.85,
        tiltY: -0.45,
        rotSpeed: 0.004,
        angle: Math.PI / 2,
        segments: 56,
        color: "rgba(168, 85, 247, 0.25)",
        satelliteAngle: Math.PI / 2,
        satelliteSpeed: 0.015,
        satelliteTrail: [],
      },
    ];

    // 3. Floating 3D Geometric Polyhedra
    // Golden ratio for icosahedron
    const phi = (1 + Math.sqrt(5)) / 2;

    const icoVertices: [number, number, number][] = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
    ];

    const icoFaces: number[][] = [
      [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
      [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
      [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
      [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
    ];

    // Octahedron geometry
    const octVertices: [number, number, number][] = [
      [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]
    ];
    const octFaces: number[][] = [
      [0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4],
      [0, 2, 5], [2, 1, 5], [1, 3, 5], [3, 0, 5]
    ];

    // Cube / Hexahedron geometry
    const cubeVertices: [number, number, number][] = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
    ];
    const cubeFaces: number[][] = [
      [0, 1, 2, 3], // Front
      [5, 4, 7, 6], // Back
      [4, 0, 3, 7], // Left
      [1, 5, 6, 2], // Right
      [3, 2, 6, 7], // Top
      [4, 5, 1, 0], // Bottom
    ];

    // Instantiate distributed 3D polyhedra around the screen
    const polyhedra: Polyhedron3D[] = [
      // Central Icosahedron Crystal
      {
        center: { x: 0, y: 0, z: 0 },
        baseCenter: { x: 0, y: 0, z: 0 },
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        speedX: 0.0035,
        speedY: 0.005,
        speedZ: 0.002,
        scale: 52,
        vertices: icoVertices,
        faces: icoFaces,
        colorScheme: {
          stroke: "rgba(34, 211, 238, 0.45)",
          fillBase: [34, 211, 238],
          glow: "rgba(34, 211, 238, 0.2)",
        },
      },
      // Upper-Left Floating Octahedron
      {
        center: { x: -360, y: -220, z: 120 },
        baseCenter: { x: -360, y: -220, z: 120 },
        rotX: 0.5,
        rotY: 0.2,
        rotZ: 0,
        speedX: 0.007,
        speedY: -0.006,
        speedZ: 0.004,
        scale: 44,
        vertices: octVertices,
        faces: octFaces,
        colorScheme: {
          stroke: "rgba(52, 211, 153, 0.5)",
          fillBase: [52, 211, 153],
          glow: "rgba(52, 211, 153, 0.22)",
        },
      },
      // Upper-Right Floating Cube / Hyper-Prism
      {
        center: { x: 380, y: -190, z: 160 },
        baseCenter: { x: 380, y: -190, z: 160 },
        rotX: 0.3,
        rotY: -0.4,
        rotZ: 0.2,
        speedX: -0.005,
        speedY: 0.007,
        speedZ: 0.003,
        scale: 36,
        vertices: cubeVertices,
        faces: cubeFaces,
        colorScheme: {
          stroke: "rgba(168, 85, 247, 0.45)",
          fillBase: [168, 85, 247],
          glow: "rgba(168, 85, 247, 0.2)",
        },
      },
      // Lower-Right Floating Octahedral Shard
      {
        center: { x: 340, y: 220, z: 100 },
        baseCenter: { x: 340, y: 220, z: 100 },
        rotX: 1.1,
        rotY: 0.7,
        rotZ: 0.4,
        speedX: 0.006,
        speedY: 0.005,
        speedZ: -0.004,
        scale: 32,
        vertices: octVertices,
        faces: octFaces,
        colorScheme: {
          stroke: "rgba(56, 189, 248, 0.4)",
          fillBase: [56, 189, 248],
          glow: "rgba(56, 189, 248, 0.18)",
        },
      },
      // Lower-Left Floating Geometric Node
      {
        center: { x: -330, y: 230, z: 140 },
        baseCenter: { x: -330, y: 230, z: 140 },
        rotX: -0.8,
        rotY: 0.4,
        rotZ: -0.3,
        speedX: -0.004,
        speedY: -0.007,
        speedZ: 0.005,
        scale: 30,
        vertices: octVertices,
        faces: octFaces,
        colorScheme: {
          stroke: "rgba(45, 212, 191, 0.42)",
          fillBase: [45, 212, 191],
          glow: "rgba(45, 212, 191, 0.18)",
        },
      },
    ];

    const fov = 620;
    const camZDistance = 580;

    // 3D rotation projection helper
    const project3D = (
      x: number,
      y: number,
      z: number,
      cosY: number,
      sinY: number,
      cosX: number,
      sinX: number,
      cx: number,
      cy: number
    ) => {
      // Rotate Y (Yaw)
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;
      // Rotate X (Pitch)
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX + camZDistance;

      const scale = z2 > 10 ? fov / (fov + z2) : 0;
      return {
        x: cx + x1 * scale,
        y: cy + y2 * scale,
        z: z2,
        scale,
      };
    };

    // Vector rotation helper for local coordinates
    const rotateVertex = (
      v: [number, number, number],
      rx: number,
      ry: number,
      rz: number
    ): [number, number, number] => {
      let [x, y, z] = v;

      // X rotation
      const cx = Math.cos(rx), sx = Math.sin(rx);
      const y1 = y * cx - z * sx;
      const z1 = z * cx + y * sx;

      // Y rotation
      const cy = Math.cos(ry), sy = Math.sin(ry);
      const x2 = x * cy + z1 * sy;
      const z2 = z1 * cy - x * sy;

      // Z rotation
      const cz = Math.cos(rz), sz = Math.sin(rz);
      const x3 = x2 * cz - y1 * sz;
      const y3 = y1 * cz + x2 * sz;

      return [x3, y3, z2];
    };

    // Main animation render loop
    const render = () => {
      stateRef.current.time += 0.016;
      const { time } = stateRef.current;

      // Smooth mouse follow
      stateRef.current.mouseX +=
        (stateRef.current.targetMouseX - stateRef.current.mouseX) * 0.05;
      stateRef.current.mouseY +=
        (stateRef.current.targetMouseY - stateRef.current.mouseY) * 0.05;

      const currentRotY = time * 0.12 + stateRef.current.mouseX * 0.8;
      const currentRotX = Math.sin(time * 0.08) * 0.08 + stateRef.current.mouseY * 0.6;

      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      const palette = getPalettes(stateRef.current.mode);

      // ==========================================
      // FEATURE 1: 3D CYBER HORIZON PERSPECTIVE GRID
      // ==========================================
      if (stateRef.current.showGrid) {
        stateRef.current.gridOffsetZ = (stateRef.current.gridOffsetZ + 1.2) % 60;
        const gridBaseY = 220; // Height plane of the floor
        const gridSpacingX = 80;
        const gridRangeX = 1400;
        const minZ = 80;
        const maxZ = 1200;
        const stepZ = 60;

        ctx.save();
        ctx.lineWidth = 1;

        // Longitudinal lines (running along depth Z)
        for (let x = -gridRangeX; x <= gridRangeX; x += gridSpacingX) {
          ctx.beginPath();
          let started = false;

          for (let z = minZ; z <= maxZ; z += stepZ) {
            // Subtle undulating wave effect
            const waveY =
              gridBaseY +
              Math.sin(x * 0.003 + time * 1.4) * 14 +
              Math.cos(z * 0.004 + time) * 12;

            const proj = project3D(x, waveY, z, cosY, sinY, cosX, sinX, cx, cy);
            if (!started) {
              ctx.moveTo(proj.x, proj.y);
              started = true;
            } else {
              ctx.lineTo(proj.x, proj.y);
            }
          }

          // Distance fading alpha
          const distFactor = 1 - Math.abs(x) / gridRangeX;
          ctx.strokeStyle = palette.grid.replace(
            /[\d.]+\)$/,
            `${(0.24 * distFactor).toFixed(3)})`
          );
          ctx.stroke();
        }

        // Transverse lines (sweeping forward towards screen)
        for (let z = minZ; z <= maxZ; z += stepZ) {
          const effectiveZ = z - stateRef.current.gridOffsetZ;
          if (effectiveZ < minZ) continue;

          ctx.beginPath();
          let started = false;

          for (let x = -gridRangeX; x <= gridRangeX; x += 120) {
            const waveY =
              gridBaseY +
              Math.sin(x * 0.003 + time * 1.4) * 14 +
              Math.cos(effectiveZ * 0.004 + time) * 12;

            const proj = project3D(x, waveY, effectiveZ, cosY, sinY, cosX, sinX, cx, cy);
            if (!started) {
              ctx.moveTo(proj.x, proj.y);
              started = true;
            } else {
              ctx.lineTo(proj.x, proj.y);
            }
          }

          const depthAlpha = Math.max(0, 1 - (effectiveZ - minZ) / (maxZ - minZ));
          ctx.strokeStyle = palette.grid.replace(
            /[\d.]+\)$/,
            `${(0.3 * depthAlpha).toFixed(3)})`
          );
          ctx.stroke();
        }
        ctx.restore();
      }

      // ==========================================
      // FEATURE 2: 3D EXPANDING SHOCKWAVES (CLICK/TAP)
      // ==========================================
      for (let sIdx = stateRef.current.shockwaves.length - 1; sIdx >= 0; sIdx--) {
        const sw = stateRef.current.shockwaves[sIdx];
        sw.radius += sw.speed;
        sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);

        if (sw.alpha <= 0.01) {
          stateRef.current.shockwaves.splice(sIdx, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        const segments = 32;
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          const rx = sw.x + Math.cos(theta) * sw.radius;
          const ry = sw.y + Math.sin(theta) * (sw.radius * 0.6); // Perspective foreshortening
          const rz = sw.z;
          const p = project3D(rx, ry, rz, cosY, sinY, cosX, sinX, cx, cy);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(34, 211, 238, ${sw.alpha * 0.65})`;
        ctx.lineWidth = 2 * sw.alpha;
        ctx.shadowColor = "rgba(34, 211, 238, 0.8)";
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
      }

      // ==========================================
      // FEATURE 3: 3D GYROSCOPIC ORBITAL RINGS & SATELLITES
      // ==========================================
      if (stateRef.current.showRings) {
        rings.forEach((ring, idx) => {
          ring.angle += ring.rotSpeed;
          ring.satelliteAngle += ring.satelliteSpeed;

          const ringCosX = Math.cos(ring.tiltX);
          const ringSinX = Math.sin(ring.tiltX);
          const ringCosY = Math.cos(ring.tiltY + ring.angle);
          const ringSinY = Math.sin(ring.tiltY + ring.angle);

          // Draw orbital ring
          ctx.beginPath();
          let first = true;
          for (let s = 0; s <= ring.segments; s++) {
            const theta = (s / ring.segments) * Math.PI * 2;
            const rx = Math.cos(theta) * ring.radius;
            const ry = 0;
            const rz = Math.sin(theta) * ring.radius;

            const y1 = ry * ringCosX - rz * ringSinX;
            const z1 = rz * ringCosX + ry * ringSinX;
            const x2 = rx * ringCosY - z1 * ringSinY;
            const z2 = z1 * ringCosY + rx * ringSinY;

            const proj = project3D(x2, y1, z2, cosY, sinY, cosX, sinX, cx, cy);
            if (first) {
              ctx.moveTo(proj.x, proj.y);
              first = false;
            } else {
              ctx.lineTo(proj.x, proj.y);
            }
          }
          ctx.closePath();
          ctx.strokeStyle = palette.rings[idx % palette.rings.length];
          ctx.lineWidth = 1.3;
          ctx.stroke();

          // Satellite beacon traveling along this ring
          const satTheta = ring.satelliteAngle;
          const srx = Math.cos(satTheta) * ring.radius;
          const sry = 0;
          const srz = Math.sin(satTheta) * ring.radius;

          const sy1 = sry * ringCosX - srz * ringSinX;
          const sz1 = srz * ringCosX + sry * ringSinX;
          const sx2 = srx * ringCosY - sz1 * ringSinY;
          const sz2 = sz1 * ringCosY + srx * ringSinY;

          const satProj = project3D(sx2, sy1, sz2, cosY, sinY, cosX, sinX, cx, cy);

          // Trail update
          ring.satelliteTrail.unshift({ x: satProj.x, y: satProj.y, alpha: 1 });
          if (ring.satelliteTrail.length > 8) ring.satelliteTrail.pop();

          // Draw satellite comet trail
          for (let t = 0; t < ring.satelliteTrail.length; t++) {
            const tr = ring.satelliteTrail[t];
            const trailAlpha = (1 - t / ring.satelliteTrail.length) * 0.45;
            ctx.beginPath();
            ctx.arc(tr.x, tr.y, Math.max(1, 2.5 * satProj.scale * (1 - t / 10)), 0, Math.PI * 2);
            ctx.fillStyle = palette.satellite.replace("1)", `${trailAlpha.toFixed(2)})`);
            ctx.fill();
          }

          // Draw main satellite beacon
          ctx.save();
          ctx.beginPath();
          ctx.arc(satProj.x, satProj.y, Math.max(1.8, 4.2 * satProj.scale), 0, Math.PI * 2);
          ctx.fillStyle = palette.satellite;
          ctx.shadowColor = palette.satellite;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.restore();
        });
      }

      // ==========================================
      // FEATURE 4: 3D FLOATING GEOMETRIC POLYHEDRA
      // ==========================================
      if (stateRef.current.showPolyhedra) {
        // Dynamic virtual light source (drifts with mouse)
        const lightDir = {
          x: stateRef.current.mouseX * 0.6 + 0.3,
          y: stateRef.current.mouseY * 0.6 - 0.5,
          z: -0.7,
        };
        const lightLen = Math.hypot(lightDir.x, lightDir.y, lightDir.z);
        lightDir.x /= lightLen;
        lightDir.y /= lightLen;
        lightDir.z /= lightLen;

        polyhedra.forEach((poly, polyIdx) => {
          poly.rotX += poly.speedX;
          poly.rotY += poly.speedY;
          poly.rotZ += poly.speedZ;

          // Bobbing oscillation
          poly.center.y = poly.baseCenter.y + Math.sin(time * 1.5 + polyIdx) * 16;
          poly.center.x = poly.baseCenter.x + Math.cos(time * 0.8 + polyIdx) * 10;

          // Transform and project all vertices of this polyhedron
          const transformedVertices: { x: number; y: number; z: number; px: number; py: number; scale: number }[] = [];

          poly.vertices.forEach((v) => {
            // Local 3D rotation
            const [rx, ry, rz] = rotateVertex(v, poly.rotX, poly.rotY, poly.rotZ);
            // World scale + translation
            const wx = poly.center.x + rx * poly.scale;
            const wy = poly.center.y + ry * poly.scale;
            const wz = poly.center.z + rz * poly.scale;

            // Camera perspective projection
            const proj = project3D(wx, wy, wz, cosY, sinY, cosX, sinX, cx, cy);
            transformedVertices.push({
              x: wx,
              y: wy,
              z: wz,
              px: proj.x,
              py: proj.y,
              scale: proj.scale,
            });
          });

          // Sort faces by depth for clean painter's algorithm
          interface FaceData {
            indices: number[];
            avgZ: number;
            normalZ: number;
            intensity: number;
          }

          const faceDataList: FaceData[] = [];

          poly.faces.forEach((face) => {
            const v0 = transformedVertices[face[0]];
            const v1 = transformedVertices[face[1]];
            const v2 = transformedVertices[face[2]];
            if (!v0 || !v1 || !v2) return;

            // Calculate 3D surface normal
            const ax = v1.x - v0.x;
            const ay = v1.y - v0.y;
            const az = v1.z - v0.z;

            const bx = v2.x - v0.x;
            const by = v2.y - v0.y;
            const bz = v2.z - v0.z;

            let nx = ay * bz - az * by;
            let ny = az * bx - ax * bz;
            let nz = ax * by - ay * bx;
            const len = Math.hypot(nx, ny, nz);
            if (len > 0) {
              nx /= len;
              ny /= len;
              nz /= len;
            }

            // Directional light intensity (Lambertian)
            const dot = nx * lightDir.x + ny * lightDir.y + nz * lightDir.z;
            const intensity = Math.max(0.12, (dot + 1) * 0.45);

            let avgZ = 0;
            face.forEach((idx) => {
              avgZ += transformedVertices[idx].z;
            });
            avgZ /= face.length;

            faceDataList.push({
              indices: face,
              avgZ,
              normalZ: nz,
              intensity,
            });
          });

          // Sort farthest to nearest
          faceDataList.sort((a, b) => b.avgZ - a.avgZ);

          // Render faces with specular luminescence
          faceDataList.forEach((fd) => {
            ctx.beginPath();
            fd.indices.forEach((idx, i) => {
              const tv = transformedVertices[idx];
              if (i === 0) ctx.moveTo(tv.px, tv.py);
              else ctx.lineTo(tv.px, tv.py);
            });
            ctx.closePath();

            // Dynamic face fill
            const [r, g, b] = poly.colorScheme.fillBase;
            const alpha = 0.08 + fd.intensity * 0.22;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
            ctx.fill();

            // Edge stroke
            ctx.strokeStyle = poly.colorScheme.stroke;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          });

          // Glowing vertices nodes
          transformedVertices.forEach((tv) => {
            ctx.beginPath();
            ctx.arc(tv.px, tv.py, Math.max(0.8, 2.2 * tv.scale), 0, Math.PI * 2);
            ctx.fillStyle = poly.colorScheme.stroke;
            ctx.fill();
          });

          // Central core pulsation for primary center crystal
          if (polyIdx === 0) {
            const centerProj = project3D(
              poly.center.x,
              poly.center.y,
              poly.center.z,
              cosY,
              sinY,
              cosX,
              sinX,
              cx,
              cy
            );
            const corePulse = 18 + Math.sin(time * 3) * 6;
            const grad = ctx.createRadialGradient(
              centerProj.x,
              centerProj.y,
              0,
              centerProj.x,
              centerProj.y,
              corePulse * centerProj.scale * 1.5
            );
            grad.addColorStop(0, "rgba(34, 211, 238, 0.45)");
            grad.addColorStop(0.5, "rgba(52, 211, 153, 0.25)");
            grad.addColorStop(1, "rgba(0, 0, 0, 0)");

            ctx.save();
            ctx.beginPath();
            ctx.arc(centerProj.x, centerProj.y, corePulse * centerProj.scale * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.restore();
          }
        });
      }

      // ==========================================
      // FEATURE 5: 3D CONSTELLATION SWARM & STARFIELD
      // ==========================================
      const projectedNodes: { x: number; y: number; z: number; scale: number; node: Node3D }[] = [];

      nodes.forEach((node) => {
        // Natural drift
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        // Spherical boundary deflection
        const dist = Math.hypot(node.x, node.y, node.z);
        if (dist > 440 || dist < 110) {
          node.vx *= -1;
          node.vy *= -1;
          node.vz *= -1;
        }

        node.pulsePhase += 0.035;
        const proj = project3D(node.x, node.y, node.z, cosY, sinY, cosX, sinX, cx, cy);
        projectedNodes.push({ ...proj, node });
      });

      // True 3D Euclidean constellation links
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i].node;
          const n2 = projectedNodes[j].node;
          const d3 = Math.hypot(n1.x - n2.x, n1.y - n2.y, n1.z - n2.z);

          if (d3 < 105) {
            const p1 = projectedNodes[i];
            const p2 = projectedNodes[j];
            const alpha = (1 - d3 / 105) * 0.26 * Math.min(p1.scale, p2.scale);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = palette.nodes[i % palette.nodes.length].replace(
              /[\d.]+\)$/,
              `${alpha.toFixed(3)})`
            );
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Render individual star nodes with depth glow
      projectedNodes.forEach((p, idx) => {
        const pulse = 1 + 0.3 * Math.sin(p.node.pulsePhase);
        const radius = Math.max(0.6, p.node.size * p.scale * pulse);
        const col = palette.nodes[idx % palette.nodes.length];

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();

        // Soft outer depth halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 2.3, 0, Math.PI * 2);
        ctx.fillStyle = col.replace(/[\d.]+\)$/, "0.14)");
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      onClick={handleCanvasClick}
      className={`absolute inset-0 overflow-hidden pointer-events-auto z-0 ${className}`}
    >
      {/* 3D Dynamic WebGL/Canvas Simulation Layer */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-85 cursor-crosshair"
      />

      {/* Atmospheric Multi-Layer Radial Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[550px] h-[550px] bg-emerald-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Interactive 3D HUD Controller Pill */}
      {showHud && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-5 left-5 z-20 pointer-events-auto"
        >
          <div className="bg-black/65 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 rounded-2xl p-2.5 shadow-2xl transition-all text-xs text-gray-300">
            {/* Header toggle row */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setHudExpanded(!hudExpanded)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white font-medium cursor-pointer"
                title="Toggle 3D Engine Controls"
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute" />
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>
                <span className="text-[11px] tracking-wide font-semibold text-cyan-300">
                  3D Engine
                </span>
                {hudExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>

              <span className="text-[10px] text-gray-400 hidden sm:inline">
                Click background to pulse 3D shockwave
              </span>
            </div>

            {/* Expanded HUD panel */}
            {hudExpanded && (
              <div className="mt-3 pt-3 border-t border-white/10 space-y-2.5 min-w-[210px]">
                {/* Mode Selector */}
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>3D Aesthetic Theme</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {(["cyber", "cosmic", "quantum"] as Background3DMode[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-medium capitalize transition-all cursor-pointer ${
                          mode === m
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                            : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layer Toggles */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                    <Layers className="w-3 h-3 text-emerald-400" />
                    <span>3D Geometry Layers</span>
                  </div>

                  <div className="flex flex-col gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setShowGrid(!showGrid)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        showGrid
                          ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                          : "bg-white/5 text-gray-400"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Box className="w-3 h-3" />
                        Cyber Horizon Grid
                      </span>
                      <span className="text-[9px] uppercase font-bold tracking-wider">
                        {showGrid ? "On" : "Off"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPolyhedra(!showPolyhedra)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        showPolyhedra
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : "bg-white/5 text-gray-400"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Box className="w-3 h-3" />
                        Floating Polyhedra
                      </span>
                      <span className="text-[9px] uppercase font-bold tracking-wider">
                        {showPolyhedra ? "On" : "Off"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowRings(!showRings)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        showRings
                          ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                          : "bg-white/5 text-gray-400"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Orbit className="w-3 h-3" />
                        Gyroscopic Orbits
                      </span>
                      <span className="text-[9px] uppercase font-bold tracking-wider">
                        {showRings ? "On" : "Off"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
