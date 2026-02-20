import { Suspense, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Float, useTexture, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ArrowDown, Mail } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { ShaderAnimation } from './ui/ShaderAnimation';
import * as THREE from 'three';

/* ────────────────────────────────────────
   Custom shader for rounded-corner texture
   PlaneGeometry gives perfect 1:1 UV mapping
   Fragment shader discards pixels outside
   the rounded rectangle boundary.
   ──────────────────────────────────────── */

const roundedCardVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const roundedCardFragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform float uRadius;
  varying vec2 vUv;

  float roundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }

  void main() {
    // Map UV [0,1] to [-0.5, 0.5]
    vec2 p = vUv - 0.5;
    vec2 halfSize = vec2(0.5);
    float d = roundedBox(p, halfSize, uRadius);
    if (d > 0.0) discard;

    vec4 texColor = texture2D(uTexture, vUv);
    // Apply sRGB correction
    texColor.rgb = pow(texColor.rgb, vec3(1.0 / 2.2));
    // Slight anti-aliasing on the edge
    float aa = 1.0 - smoothstep(-0.005, 0.0, d);
    gl_FragColor = vec4(texColor.rgb, aa);
  }
`;

/* ────────────────────────────────────────
   3D Floating Photo Card (React Three Fiber)
   ──────────────────────────────────────── */

function PhotoCard() {
    const meshRef = useRef();
    const glowRef = useRef();
    const { pointer } = useThree();
    const texture = useTexture('/ayush-rai.jpeg');

    // Ensure texture renders sharp
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const cardW = 2.4;
    const cardH = 3.0;

    const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uTexture: { value: texture },
            uResolution: { value: new THREE.Vector2(cardW, cardH) },
            uRadius: { value: 0.06 },   // corner radius in UV space (0-0.5)
        },
        vertexShader: roundedCardVertexShader,
        fragmentShader: roundedCardFragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
    }), [texture, cardW, cardH]);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        // Smooth mouse-follow rotation
        const targetRotY = pointer.x * 0.3;
        const targetRotX = -pointer.y * 0.2;
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 4 * delta);
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 4 * delta);

        // Sync glow rotation
        if (glowRef.current) {
            glowRef.current.rotation.copy(meshRef.current.rotation);
        }
    });

    return (
        <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.6} floatingRange={[-0.15, 0.15]}>
            <group ref={meshRef}>
                {/* Glow backdrop */}
                <mesh ref={glowRef} position={[0, 0, -0.08]} scale={[1.1, 1.1, 1]}>
                    <planeGeometry args={[cardW, cardH]} />
                    <meshBasicMaterial color="#a855f7" transparent opacity={0.25} />
                </mesh>

                {/* Main photo card — PlaneGeometry = perfect UV mapping */}
                <mesh>
                    <planeGeometry args={[cardW, cardH]} />
                    <primitive object={shaderMaterial} attach="material" />
                </mesh>

                {/* Subtle border glow */}
                <mesh position={[0, 0, -0.02]}>
                    <planeGeometry args={[cardW + 0.06, cardH + 0.06]} />
                    <meshBasicMaterial color="#0ea5e9" transparent opacity={0.12} />
                </mesh>
            </group>
        </Float>
    );
}

/* ── Floating particles around the card ── */
function Particles({ count = 30 }) {
    const ref = useRef();
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 6;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
        }
        return pos;
    }, [count]);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y = state.clock.elapsedTime * 0.03;
        ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.025} color="#0ea5e9" transparent opacity={0.6} sizeAttenuation />
        </points>
    );
}

/* ── Fallback while canvas loads ── */
function CanvasFallback() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-[280px] h-[350px] rounded-2xl bg-slate-800/50 animate-pulse" />
        </div>
    );
}

/* ── 3D Scene wrapper ── */
function Scene3D() {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return <CSSFallbackCard />;
    }

    return (
        <div className="w-full h-[450px] md:h-[520px]">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                onCreated={({ gl }) => {
                    gl.setClearColor(0x000000, 0);
                }}
                onError={() => setHasError(true)}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} />
                <directionalLight position={[-3, -2, 2]} intensity={0.3} color="#a855f7" />
                <pointLight position={[0, 3, 3]} intensity={0.4} color="#0ea5e9" />

                <Suspense fallback={null}>
                    <PhotoCard />
                    <Particles />
                    <Environment preset="city" environmentIntensity={0.3} />
                </Suspense>
            </Canvas>
        </div>
    );
}

/* ── CSS fallback if WebGL fails ── */
function CSSFallbackCard() {
    const cardRef = useRef(null);
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="flex items-center justify-center w-full h-[450px] md:h-[520px]">
            <div
                ref={cardRef}
                className="relative w-[280px] h-[350px] md:w-[320px] md:h-[400px] rounded-2xl overflow-hidden"
                style={{ animation: 'floatCard 4s ease-in-out infinite' }}
            >
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#0ea5e9] via-[#a855f7] to-[#0ea5e9] opacity-60 blur-sm" />
                <div className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-slate-700/50 bg-slate-900">
                    <img
                        src="/ayush-rai.jpeg"
                        alt="Ayush Rai"
                        className={`w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setLoaded(true)}
                    />
                    {!loaded && (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-mono text-sm">
                            Loading...
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-40" />
                </div>
            </div>
        </div>
    );
}

/* ────────────────────────────────────────
   Hero Section
   ──────────────────────────────────────── */
export default function Hero() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
    };
    const item = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    };

    return (
        <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
            {/* Shader animation background */}
            <div className="absolute inset-0 pointer-events-none opacity-60" aria-hidden>
                <ShaderAnimation />
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }}
                aria-hidden />

            <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center pt-24 lg:pt-0">
                {/* Text column */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <motion.div variants={item}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/5 text-brand-blue text-sm font-mono mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                        Available for work
                    </motion.div>

                    <motion.h1 variants={item}
                        className="text-6xl md:text-[6.5rem] font-black tracking-tighter leading-[1.05] mb-5">
                        <span className="text-white">Ayush </span>
                        <span className="hero-gradient-text">Rai</span>
                        <span className="text-brand-blue">.</span>
                    </motion.h1>

                    <motion.p variants={item}
                        className="text-xl md:text-2xl font-medium text-slate-400 mb-5 leading-snug">
                        Full Stack Developer{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">
                            — React · Node.js · TypeScript
                        </span>
                    </motion.p>

                    <motion.p variants={item}
                        className="text-base text-slate-500 mb-10 max-w-lg leading-relaxed">
                        I craft visually stunning, highly interactive, and lightning-fast web experiences
                        that live at the intersection of engineering and design.
                    </motion.p>

                    <motion.div variants={item} className="flex flex-wrap gap-4">
                        <MagneticButton>
                            <a href="#projects"
                                className="ripple-btn px-7 py-3.5 bg-white text-slate-900 font-bold rounded-full flex items-center gap-2 hover:scale-105 active:scale-95"
                                style={{ transition: 'transform 0.2s ease' }}>
                                See my work <ArrowDown size={16} />
                            </a>
                        </MagneticButton>
                        <MagneticButton>
                            <a href="#contact"
                                className="ripple-btn px-7 py-3.5 text-white font-bold rounded-full border border-slate-600 hover:border-brand-blue hover:scale-105 active:scale-95 flex items-center gap-2"
                                style={{ transition: 'transform 0.2s ease, border-color 0.2s ease' }}>
                                Contact me <Mail size={16} />
                            </a>
                        </MagneticButton>
                    </motion.div>
                </motion.div>

                {/* 3D Scene — React Three Fiber */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="hidden md:flex items-center justify-center"
                    style={{ willChange: 'transform' }}
                >
                    <Suspense fallback={<CanvasFallback />}>
                        <Scene3D />
                    </Suspense>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
            >
                <span className="text-[10px] font-mono text-slate-600 tracking-[0.2em] uppercase">Scroll</span>
                <motion.div className="w-px h-8 bg-gradient-to-b from-brand-blue to-transparent"
                    animate={{ scaleY: [1, 0.5, 1], opacity: [0.8, 0.3, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }} />
            </motion.div>

            <style>{`
                .hero-gradient-text {
                    background-image: linear-gradient(90deg, #0ea5e9, #a855f7, #ec4899, #0ea5e9);
                    background-size: 300% auto;
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    animation: gradientWave 4s linear infinite;
                }
                @keyframes floatCard {
                    0%, 100% { transform: perspective(900px) translateY(0) rotateY(0deg) rotateX(0deg); }
                    50% { transform: perspective(900px) translateY(-10px) rotateY(3deg) rotateX(2deg); }
                }
            `}</style>
        </section >
    );
}
