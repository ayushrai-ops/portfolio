import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ShaderAnimation() {
    const containerRef = useRef(null)
    const sceneRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current

        // Track mouse position with smooth lerping
        const mouse = { x: 0.5, y: 0.5 }
        const smoothMouse = { x: 0.5, y: 0.5 }

        const onMouseMove = (e) => {
            mouse.x = e.clientX / window.innerWidth
            mouse.y = 1.0 - e.clientY / window.innerHeight
        }
        window.addEventListener("mousemove", onMouseMove)

        // Vertex shader
        const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

        // Fragment shader — smooth organic ripples that follow the mouse
        const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform vec2 mouse;

      // Smooth noise helper
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.04;

        // Mouse influence — pull the pattern towards cursor
        vec2 mouseUV = (mouse * 2.0 - 1.0);
        float mouseDist = length(uv - mouseUV);
        float mouseInfluence = smoothstep(1.8, 0.0, mouseDist);

        // Warp UV based on mouse position for organic feel
        vec2 warpedUV = uv;
        warpedUV += mouseInfluence * 0.15 * normalize(uv - mouseUV + 0.001);

        // Add subtle noise-based distortion
        float n = noise(uv * 2.0 + t * 2.0);
        warpedUV += n * 0.03;

        float lineWidth = 0.002;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i = 0; i < 5; i++){
            float fi = float(i);
            float fj = float(j);
            
            // Base ring pattern with mouse warp
            float ring = fract(t - 0.01 * fj + fi * 0.01) * 5.0;
            float dist = length(warpedUV);
            float modPat = mod(warpedUV.x + warpedUV.y, 0.2);

            // Mouse adds a gentle glow pulse
            float pulse = 1.0 + mouseInfluence * 0.5 * sin(time * 0.3 + fi);

            color[j] += lineWidth * fi * fi * pulse / abs(ring - dist + modPat);
          }
        }

        // Subtle mouse-driven colour shift
        color.r += mouseInfluence * 0.06;
        color.b += mouseInfluence * 0.08;

        // Gentle vignette
        float vignette = 1.0 - smoothstep(0.5, 1.8, length(uv));
        color *= mix(0.85, 1.0, vignette);

        gl_FragColor = vec4(color, 1.0);
      }
    `

        // Initialize Three.js scene
        const camera = new THREE.Camera()
        camera.position.z = 1

        const scene = new THREE.Scene()
        const geometry = new THREE.PlaneGeometry(2, 2)

        const uniforms = {
            time: { type: "f", value: 1.0 },
            resolution: { type: "v2", value: new THREE.Vector2() },
            mouse: { type: "v2", value: new THREE.Vector2(0.5, 0.5) },
        }

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        })

        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        container.appendChild(renderer.domElement)

        // Handle window resize
        const onWindowResize = () => {
            const width = container.clientWidth
            const height = container.clientHeight
            renderer.setSize(width, height)
            uniforms.resolution.value.x = renderer.domElement.width
            uniforms.resolution.value.y = renderer.domElement.height
        }

        // Initial resize
        onWindowResize()
        window.addEventListener("resize", onWindowResize, false)

        // Animation loop
        let lastTime = performance.now()
        const animate = (now) => {
            const animationId = requestAnimationFrame(animate)
            const dt = Math.min((now - lastTime) / 1000, 0.05) // cap delta
            lastTime = now

            // Smooth mouse interpolation for buttery movement
            const lerpFactor = 1.0 - Math.pow(0.05, dt)
            smoothMouse.x += (mouse.x - smoothMouse.x) * lerpFactor
            smoothMouse.y += (mouse.y - smoothMouse.y) * lerpFactor

            uniforms.mouse.value.set(smoothMouse.x, smoothMouse.y)
            uniforms.time.value += 0.05
            renderer.render(scene, camera)

            if (sceneRef.current) {
                sceneRef.current.animationId = animationId
            }
        }

        // Store scene references for cleanup
        sceneRef.current = {
            camera,
            scene,
            renderer,
            uniforms,
            animationId: 0,
        }

        // Start animation
        animate(performance.now())

        // Cleanup function
        return () => {
            window.removeEventListener("resize", onWindowResize)
            window.removeEventListener("mousemove", onMouseMove)

            if (sceneRef.current) {
                cancelAnimationFrame(sceneRef.current.animationId)

                if (container && sceneRef.current.renderer.domElement) {
                    container.removeChild(sceneRef.current.renderer.domElement)
                }

                sceneRef.current.renderer.dispose()
                geometry.dispose()
                material.dispose()
            }
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="w-full h-screen"
            style={{
                background: "#000",
                overflow: "hidden",
            }}
        />
    )
}
