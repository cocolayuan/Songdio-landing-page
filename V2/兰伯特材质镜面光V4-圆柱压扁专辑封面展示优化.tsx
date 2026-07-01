import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ALBUM_COVERS = [
  'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493225457124-a1a2a5f56468?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop',
];

const TOTAL_CARDS = 6;
// 核心调整 1：将卡片尺寸精准微调到 430px 视觉大小
const CARD_WIDTH = 5.1; 
const CARD_HEIGHT = 5.1;

// 核心调整 2：配合卡片稍微放大，微调椭圆轨道的 X 和 Z 半径
const RADIUS_X = 7.3; 
const RADIUS_Z = 2.65; 

const safeMod = (a, b) => ((a % b) + b) % b;

// 生成圆角 Alpha 遮罩
const getRoundedAlphaMap = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
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

// 创建弯曲平面
const createBentPlaneGeometry = (width, height, radius) => {
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

export default function App() {
  const mountRef = useRef(null);
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

    // 核心光影回调：降低亮度，避免过曝，恢复色彩的饱和度与沉稳的高级哑光质感
    const ambientLight = new THREE.AmbientLight(0xffffff, 4.5);
    scene.add(ambientLight);
    
    // 回调平行光强度，使正面照明自然而不泛白
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(0, 0, 10);
    scene.add(dirLight);

    const carouselGroup = new THREE.Group();
    carouselGroup.position.set(0, 0, -RADIUS_Z);
    scene.add(carouselGroup);

    const roundedAlphaMap = getRoundedAlphaMap();
    
    const materials = [];
    const cardGroups = [];
    
    const colorActive = new THREE.Color('#ffffff');
    const colorSide = new THREE.Color('#f5f5f5'); 
    const colorInactive = new THREE.Color('#888888'); // 提高后排基础底色亮度 (原为 #555555)

    // 核心改造：加载图片并同时生成“清晰版”和“模糊版”两套材质
    const loadTexturesWithBlur = (url, i) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        const createTextures = (sourceCanvas) => {
          // 1. 锐利图层
          const texSharp = new THREE.CanvasTexture(sourceCanvas);
          texSharp.colorSpace = THREE.SRGBColorSpace;

          // 2. 模糊图层 (使用 Canvas Filter 模拟景深模糊)
          const cBlur = document.createElement('canvas');
          cBlur.width = 512; cBlur.height = 512;
          const ctxB = cBlur.getContext('2d');
          ctxB.filter = 'blur(11px)'; // 再次减少约 40% 模糊度 (原为 19px)
          // 稍微放大绘制以消除模糊引起的白边/半透明边缘漏发
          ctxB.drawImage(sourceCanvas, -20, -20, 552, 552);
          const texBlur = new THREE.CanvasTexture(cBlur);
          texBlur.colorSpace = THREE.SRGBColorSpace;

          resolve({ sharp: texSharp, blur: texBlur });
        };

        img.onload = () => {
          const c = document.createElement('canvas');
          c.width = 512; c.height = 512;
          const ctx = c.getContext('2d');
          const size = Math.min(img.width, img.height);
          const x = (img.width - size) / 2;
          const y = (img.height - size) / 2;
          ctx.drawImage(img, x, y, size, size, 0, 0, 512, 512);
          createTextures(c);
        };

        // Fallback 兜底逻辑
        img.onerror = () => {
          const c = document.createElement('canvas');
          c.width = 512; c.height = 512;
          const ctx = c.getContext('2d');
          ctx.fillStyle = '#222'; ctx.fillRect(0, 0, 512, 512);
          ctx.fillStyle = '#fff'; ctx.font = '40px sans-serif'; 
          ctx.textAlign = 'center'; ctx.fillText(`Album ${i + 1}`, 256, 256);
          createTextures(c);
        };

        img.src = url;
      });
    };

    Promise.all(ALBUM_COVERS.map((url, i) => loadTexturesWithBlur(url, i))).then((texturePairs) => {
      // 配合 430px 尺寸，微调弯曲半径
      const geometry = createBentPlaneGeometry(CARD_WIDTH, CARD_HEIGHT, 7.8);
      
      texturePairs.forEach((pair) => {
        // 锐利材质：更换为 MeshLambertMaterial，彻底消除“灯泡”反光斑
        const matSharp = new THREE.MeshLambertMaterial({
          map: pair.sharp,
          alphaMap: roundedAlphaMap,
          transparent: true,
          alphaTest: 0.05,
          side: THREE.DoubleSide
        });
        
        // 模糊材质：更换为 MeshLambertMaterial，彻底消除“灯泡”反光斑
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
        cardGroup.add(meshBlur); // 将两张网格同时放入
        
        cardGroups.push(cardGroup);
        carouselGroup.add(cardGroup);
      });
      setLoading(false);
    });

    let animationFrameId;
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

        // 核心视觉过渡逻辑
        // dist 0 (正前方) | dist 1 (左右侧面) | dist >= 2 (背后三张)
        const targetOpacitySharp = dist <= 1 ? (dist === 0 ? 1 : 0.8) : 0; 
        const targetOpacityBlur = dist >= 2 ? 0.8 : 0; // 提高后排不透明度，大幅提升视觉亮度 (原为 0.6)

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

      {/* 核心修复：基于视口高度(vh)且居中的完美遮罩，彻底解决宽屏漏边问题 */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-10 overflow-hidden">
        <div 
          className="h-full shrink-0"
          style={{
            width: '120vh', 
            background: 'linear-gradient(to right, #050505 0%, rgba(5,5,5,0) 25%, rgba(5,5,5,0) 75%, #050505 100%)',
            boxShadow: '0 0 0 50vw #050505' 
          }}
        />
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        {/* 配合 430px 视觉大小，微调 UI 容器尺寸 */}
        <div className="relative w-[360px] md:w-[460px] h-[430px]">
          {/* 左侧按钮 */}
          <button 
            onClick={handlePrev} 
            className="absolute -left-16 md:-left-20 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto transition-all active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          {/* 右侧按钮 */}
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