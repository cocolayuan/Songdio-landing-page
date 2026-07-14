import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ALBUM_TRACKS, AlbumPlayerOverlay } from "./album-player-overlay";

const ALBUM_COVERS = ALBUM_TRACKS.map((t) => t.cover);

const TOTAL_CARDS = ALBUM_TRACKS.length;
const CARD_WIDTH = 6.865;
const CARD_HEIGHT = 6.865;

const RADIUS_X = 9.826;
const RADIUS_Z = 3.567;
const BEND_RADIUS = 10.5;
const CAMERA_Z = 9.7;

const safeMod = (a: number, b: number) => ((a % b) + b) % b;

const getRoundedAlphaMap = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = "#ffffff";
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
  const overlayElRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const [loading, setLoading] = useState(true);
  const [settled, setSettled] = useState(true);
  const settledRef = useRef(true);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const setSettledSafe = (v: boolean) => {
    if (settledRef.current === v) return;
    settledRef.current = v;
    setSettled(v);
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const getSize = () => ({
      width: mount.clientWidth || 1,
      height: mount.clientHeight || 1,
    });

    const { width: initW, height: initH } = getSize();

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#050505", 16, 50);

    const camera = new THREE.PerspectiveCamera(45, initW / initH, 0.1, 100);
    camera.position.set(0, 0, CAMERA_Z);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(initW, initH);
    mount.appendChild(renderer.domElement);

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

    const colorActive = new THREE.Color("#ffffff");
    const colorSide = new THREE.Color("#f5f5f5");
    const colorInactive = new THREE.Color("#888888");

    const loadTexturesWithBlur = (url: string, i: number) => {
      return new Promise<{ sharp: THREE.CanvasTexture; blur: THREE.CanvasTexture }>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        const createTextures = (sourceCanvas: HTMLCanvasElement) => {
          const texSharp = new THREE.CanvasTexture(sourceCanvas);
          texSharp.colorSpace = THREE.SRGBColorSpace;

          const cBlur = document.createElement("canvas");
          cBlur.width = 512;
          cBlur.height = 512;
          const ctxB = cBlur.getContext("2d")!;
          ctxB.filter = "blur(11px)";
          ctxB.drawImage(sourceCanvas, -20, -20, 552, 552);
          const texBlur = new THREE.CanvasTexture(cBlur);
          texBlur.colorSpace = THREE.SRGBColorSpace;

          resolve({ sharp: texSharp, blur: texBlur });
        };

        img.onload = () => {
          const c = document.createElement("canvas");
          c.width = 512;
          c.height = 512;
          const ctx = c.getContext("2d")!;
          const size = Math.min(img.width, img.height);
          const x = (img.width - size) / 2;
          const y = (img.height - size) / 2;
          ctx.drawImage(img, x, y, size, size, 0, 0, 512, 512);
          createTextures(c);
        };

        img.onerror = () => {
          const c = document.createElement("canvas");
          c.width = 512;
          c.height = 512;
          const ctx = c.getContext("2d")!;
          ctx.fillStyle = "#222";
          ctx.fillRect(0, 0, 512, 512);
          ctx.fillStyle = "#fff";
          ctx.font = "40px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`Album ${i + 1}`, 256, 256);
          createTextures(c);
        };

        img.src = url;
      });
    };

    Promise.all(ALBUM_COVERS.map((url, i) => loadTexturesWithBlur(url, i))).then((texturePairs) => {
      const geometry = createBentPlaneGeometry(CARD_WIDTH, CARD_HEIGHT, BEND_RADIUS);

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
      currentOffset = THREE.MathUtils.damp(currentOffset, targetOffset, 8, delta);

      // Overlay rides in with the incoming card: opacity + horizontal slide follow the damp buffer
      const raw = currentOffset - targetOffset;
      const diff = Math.abs(raw);
      const REVEAL_RANGE = 0.32;
      let reveal = 1 - Math.min(1, diff / REVEAL_RANGE);
      reveal = reveal * reveal * (3 - 2 * reveal); // smoothstep
      if (overlayElRef.current) {
        const SLIDE_K = 22; // cqw per rad of lag; tune for how far it trails the card
        const slide = -raw * SLIDE_K;
        overlayElRef.current.style.opacity = String(reveal);
        overlayElRef.current.style.transform = `translate(calc(-50% + ${slide}cqw), -50%)`;
      }
      // Only clickable once essentially stopped
      setSettledSafe(diff < 0.02);

      cardGroups.forEach((card, index) => {
        const theta = Math.PI / 2 + currentOffset - index * ((Math.PI * 2) / TOTAL_CARDS);

        const x = RADIUS_X * Math.cos(theta);
        const z = RADIUS_Z * Math.sin(theta);
        card.position.set(x, 0, z);

        const normalAngle = Math.atan2(x / (RADIUS_X * RADIUS_X), z / (RADIUS_Z * RADIUS_Z));
        card.rotation.y = normalAngle;

        let diff = safeMod(index - activeIndexRef.current, TOTAL_CARDS);
        if (diff > TOTAL_CARDS / 2) diff -= TOTAL_CARDS;
        const dist = Math.abs(diff);

        const targetOpacitySharp = dist <= 1 ? (dist === 0 ? 1 : 0.8) : 0;
        const targetOpacityBlur = dist >= 2 ? 0.8 : 0;

        const targetColor = dist === 0 ? colorActive : dist === 1 ? colorSide : colorInactive;

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

    const applySize = () => {
      const { width, height } = getSize();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(applySize);
    resizeObserver.observe(mount);
    window.addEventListener("resize", applySize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", applySize);
      cancelAnimationFrame(animationFrameId);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handlePrev = () => {
    setSettledSafe(false);
    setActiveIndex((prev) => prev - 1);
  };
  const handleNext = () => {
    setSettledSafe(false);
    setActiveIndex((prev) => prev + 1);
  };
  const albumIndex = safeMod(activeIndex, TOTAL_CARDS);

  return (
    <div className="absolute inset-0 overflow-hidden [container-type:size]">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-white/50 z-30 tracking-widest text-sm font-light">
          LOADING...
        </div>
      )}

      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Side fade: shallow curve — transparent near center, ~30% at 80% toward edge, solid at outer */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-10 overflow-hidden">
        <div
          className="h-full shrink-0"
          style={{
            width: "min(100%, 185cqh)",
            background:
              "linear-gradient(to right, #000 0%, rgba(0,0,0,0.3) 10%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.3) 90%, #000 100%)",
            boxShadow: "0 0 0 50cqw #000",
          }}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="relative w-[619px] h-[579px] max-w-[90%] max-h-[85%]">
          {!loading && (
            <AlbumPlayerOverlay albumIndex={albumIndex} visible={settled} rootRef={overlayElRef} />
          )}

          <button
            type="button"
            onClick={handlePrev}
            className="absolute -left-32 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-all active:scale-95"
          >
            <ChevronLeft className="w-7 h-7 text-white" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute -right-32 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-all active:scale-95"
          >
            <ChevronRight className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
