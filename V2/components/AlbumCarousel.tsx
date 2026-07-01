"use client";

import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ALBUM_COVERS = [
  '/album-covers/01.png',
  '/album-covers/02.png',
  '/album-covers/03.png',
  '/album-covers/04.png',
  '/album-covers/05.png',
  '/album-covers/06.png',
];

const TOTAL_CARDS = 6;
const CARD_WIDTH = 5.1;
const CARD_HEIGHT = 5.1;

const RADIUS_X = 7.3;
const RADIUS_Z = 2.65;

const safeMod = (a: number, b: number) => ((a % b) + b) % b;

const getRoundedAlphaMap = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = '#ffffff';
  const r = 60;
  const w = 512;
  const h = 512;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(w - r, 0);
  ctx.quadraticCurveTo(w, 0, w, r);
  ctx.lineTo(w, h - r);
  ctx.quadraticCurveTo(w, h, w - r, h);
  ctx.lineTo(r, h);
  ctx.quadraticCurveTo(0, h, 0, h - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
};

const createBentPlaneGeometry = (width: number, height: number, radius: number) => {
  const geometry = new THREE.PlaneGeometry(width, height, 32, 1);
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const z = Math.sqrt(radius * radius - x * x) - radius;
    positions.setZ(i, z);
  }
  geometry.computeVertexNormals();
  return geometry;
};

export default function AlbumCarousel() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050505');
    scene.fog = new THREE.Fog('#050505', 16, 50);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 13);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 4.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(0, 0, 10);
    scene.add(dirLight);

    const carouselGroup = new THREE.Group();
    carouselGroup.position.set(0, 0, -RADIUS_Z);
    scene.add(carouselGroup);

    const roundedAlphaMap = getRoundedAlphaMap();

    const materials: { sharp: THREE.MeshLambertMaterial; blur: THREE.MeshLambertMaterial }[] = [];
    const cardGroups: THREE.Group[] = [];

    const colorActive = new THREE.Color('#ffffff');
    const colorSide = new THREE.Color('#f5f5f5');
    const colorInactive = new THREE.Color('#888888');

    const loadTexturesWithBlur = (url: string, i: number) => {
      return new Promise<{ sharp: THREE.CanvasTexture; blur: THREE.CanvasTexture }>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        const createTextures = (sourceCanvas: HTMLCanvasElement) => {
          const texSharp = new THREE.CanvasTexture(sourceCanvas);
          texSharp.colorSpace = THREE.SRGBColorSpace;

          const cBlur = document.createElement('canvas');
          cBlur.width = 512;
          cBlur.height = 512;
          const ctxB = cBlur.getContext('2d')!;
          ctxB.filter = 'blur(11px)';
          ctxB.drawImage(sourceCanvas, -20, -20, 552, 552);
          const texBlur = new THREE.CanvasTexture(cBlur);
          texBlur.colorSpace = THREE.SRGBColorSpace;

          resolve({ sharp: texSharp, blur: texBlur });
        };

        img.onload = () => {
          const c = document.createElement('canvas');
          c.width = 512;
          c.height = 512;
          const ctx = c.getContext('2d')!;
          const size = Math.min(img.width, img.height);
          const x = (img.width - size) / 2;
          const y = (img.height - size) / 2;
          ctx.drawImage(img, x, y, size, size, 0, 0, 512, 512);
          createTextures(c);
        };

        img.onerror = () => {
          const c = document.createElement('canvas');
          c.width = 512;
          c.height = 512;
          const ctx = c.getContext('2d')!;
          ctx.fillStyle = '#222';
          ctx.fillRect(0, 0, 512, 512);
          ctx.fillStyle = '#fff';
          ctx.font = '40px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`Album ${i + 1}`, 256, 256);
          createTextures(c);
        };

        img.src = url;
      });
    };

    Promise.all(ALBUM_COVERS.map((url, i) => loadTexturesWithBlur(url, i))).then((texturePairs) => {
      const geometry = createBentPlaneGeometry(CARD_WIDTH, CARD_HEIGHT, 7.8);

      texturePairs.forEach((pair) => {
        const matSharp = new THREE.MeshLambertMaterial({
          map: pair.sharp,
          alphaMap: roundedAlphaMap,
          transparent: true,
          alphaTest: 0.05,
          side: THREE.DoubleSide,
        });

        const matBlur = new THREE.MeshLambertMaterial({
          map: pair.blur,
          alphaMap: roundedAlphaMap,
          transparent: true,
          alphaTest: 0.05,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: 1,
        });

        materials.push({ sharp: matSharp, blur: matBlur });

        const meshSharp = new THREE.Mesh(geometry, matSharp);
        const meshBlur = new THREE.Mesh(geometry, matBlur);

        const cardGroup = new THREE.Group();
        cardGroup.add(meshSharp);
        cardGroup.add(meshBlur);

        cardGroups.push(cardGroup);
        carouselGroup.add(cardGroup);
      });
      setLoading(false);
    });

    let animationFrameId: number;
    const clock = new THREE.Clock();
    let currentOffset = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      const targetOffset = activeIndexRef.current * ((Math.PI * 2) / TOTAL_CARDS);
      currentOffset = THREE.MathUtils.damp(currentOffset, targetOffset, 5, delta);

      cardGroups.forEach((card, index) => {
        const theta = (Math.PI / 2) + currentOffset - (index * ((Math.PI * 2) / TOTAL_CARDS));

        const x = RADIUS_X * Math.cos(theta);
        const z = RADIUS_Z * Math.sin(theta);
        card.position.set(x, 0, z);

        const normalAngle = Math.atan2(
          x / (RADIUS_X * RADIUS_X),
          z / (RADIUS_Z * RADIUS_Z)
        );
        card.rotation.y = normalAngle;

        let diff = safeMod(index - activeIndexRef.current, TOTAL_CARDS);
        if (diff > TOTAL_CARDS / 2) diff -= TOTAL_CARDS;
        const dist = Math.abs(diff);

        const targetOpacitySharp = dist <= 1 ? (dist === 0 ? 1 : 0.8) : 0;
        const targetOpacityBlur = dist >= 2 ? 0.8 : 0;

        const targetColor = dist === 0 ? colorActive : (dist === 1 ? colorSide : colorInactive);

        const mats = materials[index];
        if (mats) {
          mats.sharp.opacity = THREE.MathUtils.damp(mats.sharp.opacity, targetOpacitySharp, 6, delta);
          mats.blur.opacity = THREE.MathUtils.damp(mats.blur.opacity, targetOpacityBlur, 6, delta);

          mats.sharp.color.lerp(targetColor, 0.1);
          mats.blur.color.lerp(targetColor, 0.1);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handlePrev = () => setActiveIndex((prev) => prev - 1);
  const handleNext = () => setActiveIndex((prev) => prev + 1);

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#050505', position: 'relative', overflow: 'hidden' }}>
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between text-gray-400 text-sm tracking-widest z-10 pointer-events-none">
        <div>FEATURED DISCOGRAPHY</div>
      </div>

      {loading && <div className="absolute inset-0 flex items-center justify-center text-white/50 z-30 tracking-widest text-sm font-light">LOADING...</div>}

      <div ref={mountRef} className="absolute inset-0 z-0" />

      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-10 overflow-hidden">
        <div
          className="h-full shrink-0"
          style={{
            width: '120vh',
            background: 'linear-gradient(to right, #050505 0%, rgba(5,5,5,0) 25%, rgba(5,5,5,0) 75%, #050505 100%)',
            boxShadow: '0 0 0 50vw #050505',
          }}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="relative w-[360px] md:w-[460px] h-[430px]">
          <button
            onClick={handlePrev}
            className="absolute -left-16 md:-left-20 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-all active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={handleNext}
            className="absolute -right-16 md:-right-20 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-all active:scale-95"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
