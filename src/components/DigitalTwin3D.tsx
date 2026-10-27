import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { 
  Box, 
  Layers, 
  Sun, 
  Moon, 
  RotateCcw, 
  Maximize2, 
  Info, 
  Sparkles,
  Camera,
  Activity,
  Compass
} from "lucide-react";

interface Hotspot {
  position: THREE.Vector3;
  title: string;
  description: string;
}

export const DigitalTwin3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [modelType, setModelType] = useState<"stepwell" | "wheel" | "vimana">("stepwell");
  const [wireframe, setWireframe] = useState(false);
  const [lighting, setLighting] = useState<"day" | "golden" | "torch">("golden");
  const [solarBeam, setSolarBeam] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activePipelineStage, setActivePipelineStage] = useState<"photos" | "points" | "mesh" | "twin">("twin");

  // Keep references to Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const solarRayRef = useRef<THREE.Mesh | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0c111d);
    scene.fog = new THREE.FogExp2(0x0c111d, 0.025);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(12, 14, 16);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambient = new THREE.AmbientLight(0xffecd2, 0.7);
    scene.add(ambient);
    ambientLightRef.current = ambient;

    const dirLight = new THREE.DirectionalLight(0xffb259, 1.8);
    dirLight.position.set(15, 25, 12);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Subtle Ground Grid
    const gridHelper = new THREE.GridHelper(30, 30, 0xd97706, 0x1f2937);
    gridHelper.position.y = -3.5;
    scene.add(gridHelper);

    // Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Mouse Drag Interaction (Orbit simulation)
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let rotation = { x: 0.2, y: 0.5 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      rotation.y += deltaX * 0.008;
      rotation.x += deltaY * 0.008;
      rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 2.5, rotation.x));
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.015;
      camera.position.z = Math.max(6, Math.min(30, camera.position.z));
      camera.position.x = camera.position.z * 0.8;
      camera.position.y = camera.position.z * 0.7;
      camera.lookAt(0, 0, 0);
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    dom.addEventListener("wheel", onWheel, { passive: false });

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (autoRotate && !isDragging) {
        rotation.y += 0.004;
      }

      if (modelGroupRef.current) {
        modelGroupRef.current.rotation.y = rotation.y;
        modelGroupRef.current.rotation.x = rotation.x;
      }

      // Pulsing solar ray
      if (solarRayRef.current) {
        const mat = solarRayRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.35 + Math.sin(elapsedTime * 3) * 0.15;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [autoRotate]);

  // Rebuild 3D Model when modelType or wireframe changes
  useEffect(() => {
    const group = modelGroupRef.current;
    const scene = sceneRef.current;
    if (!group || !scene) return;

    // Clear previous models
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
    }
    if (solarRayRef.current) {
      scene.remove(solarRayRef.current);
      solarRayRef.current = null;
    }

    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0xc89d66, // Sandstone tone
      roughness: 0.85,
      metalness: 0.1,
      wireframe: wireframe,
    });

    const darkStoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x8c6b45,
      roughness: 0.9,
      metalness: 0.15,
      wireframe: wireframe,
    });

    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
      wireframe: wireframe,
    });

    if (modelType === "stepwell") {
      // Build Subterranean Stepwell (e.g. Rani ki Vav / Chand Baori / Surya Kund)
      const tiers = 6;
      for (let i = 0; i < tiers; i++) {
        const width = 12 - i * 1.6;
        const depth = 16 - i * 2.0;
        const yPos = -i * 0.8;

        // Stepped terraced perimeter
        const wallGeo = new THREE.BoxGeometry(width, 0.7, depth);
        const wallMesh = new THREE.Mesh(wallGeo, i % 2 === 0 ? stoneMaterial : darkStoneMaterial);
        wallMesh.position.y = yPos;
        wallMesh.castShadow = true;
        wallMesh.receiveShadow = true;
        group.add(wallMesh);

        // Subterranean Pillars along pavilions
        for (let px = -width / 2.5; px <= width / 2.5; px += width / 2.5) {
          for (let pz = -depth / 2.5; pz <= depth / 2.5; pz += depth / 2.5) {
            const pillarGeo = new THREE.CylinderGeometry(0.12, 0.16, 1.2, 8);
            const pillar = new THREE.Mesh(pillarGeo, stoneMaterial);
            pillar.position.set(px, yPos + 0.6, pz);
            pillar.castShadow = true;
            group.add(pillar);
          }
        }
      }

      // Bottom sacred water pool
      const poolGeo = new THREE.BoxGeometry(3.5, 0.2, 5.0);
      const poolMesh = new THREE.Mesh(poolGeo, waterMaterial);
      poolMesh.position.y = -tiers * 0.8 + 0.1;
      group.add(poolMesh);

      // Solar equinox beam
      if (solarBeam) {
        const rayGeo = new THREE.CylinderGeometry(0.08, 0.6, 24, 16);
        const rayMat = new THREE.MeshBasicMaterial({
          color: 0xfef08a,
          transparent: true,
          opacity: 0.45,
          side: THREE.DoubleSide
        });
        const rayMesh = new THREE.Mesh(rayGeo, rayMat);
        rayMesh.position.set(4, 8, 4);
        rayMesh.rotation.z = Math.PI / 4.5;
        rayMesh.rotation.x = Math.PI / 6;
        scene.add(rayMesh);
        solarRayRef.current = rayMesh;
      }

    } else if (modelType === "wheel") {
      // Build Konark Chariot Sun Wheel
      const wheelGroup = new THREE.Group();

      // Outer Carved Rim
      const rimGeo = new THREE.TorusGeometry(3.8, 0.45, 16, 48);
      const rim = new THREE.Mesh(rimGeo, stoneMaterial);
      wheelGroup.add(rim);

      // Inner Medallion Rim
      const innerRimGeo = new THREE.TorusGeometry(1.6, 0.25, 12, 32);
      const innerRim = new THREE.Mesh(innerRimGeo, darkStoneMaterial);
      wheelGroup.add(innerRim);

      // Central Axis Hub (Lotus motif)
      const hubGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.8, 24);
      hubGeo.rotateX(Math.PI / 2);
      const hub = new THREE.Mesh(hubGeo, stoneMaterial);
      wheelGroup.add(hub);

      // 16 Sculpted Spokes (8 major with medallions, 8 minor)
      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI * 2) / 16;
        const isMajor = i % 2 === 0;
        const spokeLength = 3.6;

        const spokeGeo = new THREE.CylinderGeometry(isMajor ? 0.16 : 0.09, isMajor ? 0.22 : 0.12, spokeLength, 8);
        const spoke = new THREE.Mesh(spokeGeo, isMajor ? stoneMaterial : darkStoneMaterial);
        spoke.position.x = Math.cos(angle) * (spokeLength / 2);
        spoke.position.y = Math.sin(angle) * (spokeLength / 2);
        spoke.rotation.z = angle - Math.PI / 2;
        wheelGroup.add(spoke);

        // Sundial bead on major spokes
        if (isMajor) {
          const beadGeo = new THREE.SphereGeometry(0.3, 12, 12);
          const bead = new THREE.Mesh(beadGeo, darkStoneMaterial);
          bead.position.x = Math.cos(angle) * 2.6;
          bead.position.y = Math.sin(angle) * 2.6;
          wheelGroup.add(bead);
        }
      }

      // Base pedestal
      const pedGeo = new THREE.BoxGeometry(9.0, 1.2, 3.5);
      const ped = new THREE.Mesh(pedGeo, darkStoneMaterial);
      ped.position.y = -4.2;
      wheelGroup.add(ped);

      group.add(wheelGroup);

    } else if (modelType === "vimana") {
      // Build Dravidian / Nagara Towering Shikhara (Brihadeeswarar / Khajuraho)
      const towerGroup = new THREE.Group();

      // Jagati Base
      const baseGeo = new THREE.BoxGeometry(8, 1.0, 8);
      const base = new THREE.Mesh(baseGeo, darkStoneMaterial);
      base.position.y = -3.0;
      towerGroup.add(base);

      // Tiered Talas (12 ascending tiers)
      const talas = 10;
      for (let i = 0; i < talas; i++) {
        const scale = 1 - i * 0.085;
        const width = 6.5 * scale;
        const height = 0.8;
        const yPos = -2.2 + i * 0.75;

        const talaGeo = new THREE.BoxGeometry(width, height, width);
        const tala = new THREE.Mesh(talaGeo, i % 2 === 0 ? stoneMaterial : darkStoneMaterial);
        tala.position.y = yPos;
        towerGroup.add(tala);

        // Corner Kudus (miniature shrine motifs)
        for (let cx of [-width / 2.1, width / 2.1]) {
          for (let cz of [-width / 2.1, width / 2.1]) {
            const kuduGeo = new THREE.ConeGeometry(0.25, 0.4, 4);
            const kudu = new THREE.Mesh(kuduGeo, stoneMaterial);
            kudu.position.set(cx, yPos + 0.4, cz);
            towerGroup.add(kudu);
          }
        }
      }

      // Massive Monolithic Dome (Kumbam capstone)
      const domeGeo = new THREE.SphereGeometry(1.6, 24, 16);
      domeGeo.scale(1, 0.7, 1);
      const dome = new THREE.Mesh(domeGeo, darkStoneMaterial);
      dome.position.y = -2.2 + talas * 0.75 + 0.8;
      towerGroup.add(dome);

      // Gold-plated Finial (Kalasha)
      const kalashaGeo = new THREE.ConeGeometry(0.35, 1.2, 16);
      const kalashaMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.9,
        roughness: 0.2,
        wireframe: wireframe
      });
      const kalasha = new THREE.Mesh(kalashaGeo, kalashaMat);
      kalasha.position.y = dome.position.y + 1.2;
      towerGroup.add(kalasha);

      group.add(towerGroup);
    }
  }, [modelType, wireframe, solarBeam]);

  // Lighting adjustments
  useEffect(() => {
    if (!dirLightRef.current || !ambientLightRef.current) return;
    if (lighting === "day") {
      dirLightRef.current.color.setHex(0xffffff);
      dirLightRef.current.intensity = 2.0;
      ambientLightRef.current.color.setHex(0xe0e7ff);
      ambientLightRef.current.intensity = 0.8;
    } else if (lighting === "golden") {
      dirLightRef.current.color.setHex(0xffaa44);
      dirLightRef.current.intensity = 2.4;
      ambientLightRef.current.color.setHex(0xfef08a);
      ambientLightRef.current.intensity = 0.5;
    } else {
      // Torchlight night
      dirLightRef.current.color.setHex(0xfa5252);
      dirLightRef.current.intensity = 0.9;
      ambientLightRef.current.color.setHex(0x381e10);
      ambientLightRef.current.intensity = 0.3;
    }
  }, [lighting]);

  return (
    <div className="flex flex-col h-full bg-[#0d121f] text-gray-200 rounded-xl overflow-hidden border border-amber-950/40 shadow-2xl">
      {/* 3D Viewer Header */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-[#121826]/90 border-b border-gray-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-medium text-white tracking-wide">
                WebGL 3D Digital Twin Studio
              </h2>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Pathway 1: Active
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Photogrammetric 3D reconstructions from crowdsourced archival 2D photography
            </p>
          </div>
        </div>

        {/* Model Selector */}
        <div className="flex items-center bg-gray-900/90 rounded-lg p-1 border border-gray-800">
          <button
            onClick={() => setModelType("stepwell")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              modelType === "stepwell"
                ? "bg-amber-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Rani ki Vav (Stepwell)
          </button>
          <button
            onClick={() => setModelType("wheel")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              modelType === "wheel"
                ? "bg-amber-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Konark Chariot Wheel
          </button>
          <button
            onClick={() => setModelType("vimana")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              modelType === "vimana"
                ? "bg-amber-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Brihadeeswarar Vimana
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Area */}
      <div className="relative flex-1 min-h-[460px] w-full overflow-hidden">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating Controls HUD */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <div className="flex items-center gap-1.5 bg-gray-900/85 backdrop-blur-md p-1.5 rounded-lg border border-gray-800 shadow-lg">
            <button
              onClick={() => setWireframe(!wireframe)}
              title="Toggle Mesh Wireframe"
              className={`p-2 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                wireframe ? "bg-amber-600 text-white" : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{wireframe ? "Mesh Wireframe" : "Textured"}</span>
            </button>
            <div className="w-[1px] h-5 bg-gray-700" />
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title="Toggle Auto Rotation"
              className={`p-2 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                autoRotate ? "bg-amber-600 text-white" : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>{autoRotate ? "Orbiting" : "Static"}</span>
            </button>
            <div className="w-[1px] h-5 bg-gray-700" />
            <button
              onClick={() => setSolarBeam(!solarBeam)}
              title="Toggle Equinoctial Solar Beam"
              className={`p-2 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                solarBeam ? "bg-amber-500 text-gray-950 font-bold" : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Equinox Solar Ray</span>
            </button>
          </div>

          {/* Lighting Mode Selector */}
          <div className="flex items-center gap-1 bg-gray-900/85 backdrop-blur-md p-1 rounded-lg border border-gray-800 text-xs text-gray-400">
            <span className="px-2 text-[11px] uppercase tracking-wider text-gray-500">Lighting</span>
            <button
              onClick={() => setLighting("day")}
              className={`px-2.5 py-1 rounded transition-colors ${
                lighting === "day" ? "bg-gray-700 text-amber-300" : "hover:text-white"
              }`}
            >
              Noon Sun
            </button>
            <button
              onClick={() => setLighting("golden")}
              className={`px-2.5 py-1 rounded transition-colors ${
                lighting === "golden" ? "bg-amber-700/80 text-white" : "hover:text-white"
              }`}
            >
              Golden Hour
            </button>
            <button
              onClick={() => setLighting("torch")}
              className={`px-2.5 py-1 rounded transition-colors ${
                lighting === "torch" ? "bg-rose-900/80 text-rose-300" : "hover:text-white"
              }`}
            >
              Torchlight
            </button>
          </div>
        </div>

        {/* 3D Model Telemetry Badge */}
        <div className="absolute top-4 right-4 bg-gray-900/85 backdrop-blur-md p-3 rounded-lg border border-gray-800 shadow-xl max-w-xs text-xs space-y-2">
          <div className="flex items-center justify-between text-amber-400 font-medium pb-1.5 border-b border-gray-800">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Reconstruction Stats
            </span>
            <span className="text-[10px] bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-300 border border-amber-500/20">
              WebGL 2.0
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-gray-400">
            <div>Polygons: <span className="text-white font-mono font-medium">142,800</span></div>
            <div>Vertices: <span className="text-white font-mono font-medium">78,420</span></div>
            <div>Source Photos: <span className="text-white font-mono font-medium">186 2D frames</span></div>
            <div>Scale: <span className="text-white font-mono font-medium">1:1 Metric</span></div>
          </div>
          <div className="pt-1.5 border-t border-gray-800 text-[11px] text-gray-300">
            <span className="text-amber-400 font-semibold">Interaction:</span> Drag to orbit · Scroll to zoom · Double-click to inspect
          </div>
        </div>

        {/* Photogrammetry Pipeline Progress Bar */}
        <div className="absolute bottom-4 left-4 right-4 bg-gray-900/90 backdrop-blur-md p-3 rounded-xl border border-gray-800 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-white tracking-wide">
                2D-to-3D Reconstruction Pipeline (IITGN Explorer Stream)
              </span>
            </div>
            <span className="text-[11px] text-gray-400">
              Pipeline Status: <span className="text-emerald-400 font-medium">Synthesized & Verified</span>
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "photos", label: "1. 2D Photo Ingestion", desc: "180+ mobile & DSLR field captures" },
              { id: "points", label: "2. Sparse Point Cloud", desc: "Structure from Motion (SfM)" },
              { id: "mesh", label: "3. Poisson Surface Mesh", desc: "Dense mesh & normals calculation" },
              { id: "twin", label: "4. WebGL Digital Twin", desc: "PBR materials & astronomical ray" },
            ].map((stage, idx) => (
              <div
                key={stage.id}
                className={`p-2 rounded-lg border text-left transition-all ${
                  activePipelineStage === stage.id
                    ? "bg-amber-500/15 border-amber-500/40 text-amber-200"
                    : "bg-gray-800/40 border-gray-800 text-gray-400"
                }`}
                onClick={() => setActivePipelineStage(stage.id as any)}
              >
                <div className="text-xs font-semibold text-white flex items-center justify-between">
                  <span>{stage.label}</span>
                  <span className="text-[10px] text-amber-400">✓</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5 truncate">{stage.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Educational Architectural Hotspot Details */}
      <div className="p-4 bg-[#0a0f1a] border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <div className="font-medium text-white">
              {modelType === "stepwell" && "Rani ki Vav Subterranean Architectural Geometry"}
              {modelType === "wheel" && "Konark Astronomical Sundial & Chariot Wheel Engineering"}
              {modelType === "vimana" && "Brihadeeswarar Single-stone Kumbam & Seismic Floating Plinth"}
            </div>
            <div className="text-gray-400 text-[11px]">
              {modelType === "stepwell" && "7 subterranean descending pavilions constructed in Maru-Gurjara style; aligns with the seasonal water table of the ancient Saraswati basin."}
              {modelType === "wheel" && "24 monumental carved wheels representing hours; inner spoke beads cast shadows calculating time to precision of 3 minutes."}
              {modelType === "vimana" && "66m granite vimana assembled using interlocked dry masonry without cement or binding mortar."}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-gray-400 text-[11px]">Dataset Link:</span>
          <span className="px-2.5 py-1 bg-gray-800 rounded text-amber-400 font-mono text-xs border border-gray-700">
            {modelType === "stepwell" ? "HA-0004" : modelType === "wheel" ? "HA-0001" : "HA-0005"}
          </span>
        </div>
      </div>
    </div>
  );
};
