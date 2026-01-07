import React, { useContext, useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { AssetContext } from '../Context/AssetContext.jsx'
import gsap from 'gsap'
import { ScrollSmoother, ScrollTrigger } from 'gsap/all'
import vertexShader from '../shaders/vertexshader.glsl?raw'
import fragmentShader from '../shaders/fragmentshader.glsl?raw'

const Home = () => {
    gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
    const cameraImage = useRef(null);
    const heroDiv = useRef()
    const mountRef = useRef()
    const manager = useContext(AssetContext)

    useLayoutEffect(() => {
        const distance = 600
        const fov = 2 * Math.atan((window.innerHeight / 2) / distance) * (180 / Math.PI)

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.z = distance;

        const textureLoader = new THREE.TextureLoader(manager)
        let images = document.querySelectorAll('img')

        const imageStore = []

        images.forEach((img) => {
            const imageTexture = textureLoader.load(img.src)

            // 1. Get the Computed CSS Z-Index
            const style = window.getComputedStyle(img);
            const zIndex = parseInt(style.zIndex) || 0;

            const geometry = new THREE.PlaneGeometry(1, 1, 64, 64)
            const material = new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms: {
                    uTime: { value: 0 },
                    uTexture: { value: imageTexture },
                    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                    uHover: { value: 0 }
                }
            })
            const image3D = new THREE.Mesh(geometry, material)

            image3D.position.z = zIndex;

            scene.add(image3D)

            imageStore.push({
                img: img,
                mesh: image3D,
                zIndex: zIndex
            })
        })

        // --- RAYCASTER SETUP ---
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onMouseMove = (event) => {
            // Calculate mouse position in normalized device coordinates (-1 to +1)
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }
        window.addEventListener('mousemove', onMouseMove);

        const renderer = new THREE.WebGLRenderer({ canvas: mountRef.current, antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(window.innerWidth, window.innerHeight)

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.fov = 2 * Math.atan((window.innerHeight / 2) / distance) * (180 / Math.PI)
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
        window.addEventListener('resize', handleResize)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.enableZoom = false

        let reqAni;
        const animate = () => {
            reqAni = requestAnimationFrame(animate)

            // --- RAYCASTING ---
            raycaster.setFromCamera(mouse, camera);
            // Check for intersections with all meshes in our store
            const meshes = imageStore.map(item => item.mesh);
            const intersects = raycaster.intersectObjects(meshes);

            // Reset all meshes first
            imageStore.forEach((imageState) => {
                imageState.mesh.material.uniforms.uHover.value = 0;
            });

            // If we hit an object, send the UV coordinates to its shader
            if (intersects.length > 0) {
                const intersect = intersects[0];
                const hitMesh = intersect.object;
                hitMesh.material.uniforms.uMouse.value.set(intersect.uv.x, intersect.uv.y);
                hitMesh.material.uniforms.uHover.value = 1;
            }

            // --- SYNC LOOP ---
            // Renamed 'o' to 'imageState'
            imageStore.forEach((imageState) => {
                const bounds = imageState.img.getBoundingClientRect();
                const scaleCorrection = 1 - (imageState.zIndex / distance);

                imageState.mesh.scale.set(
                    bounds.width * scaleCorrection,
                    bounds.height * scaleCorrection,
                    1
                );

                imageState.mesh.position.x = (bounds.left - window.innerWidth / 2 + bounds.width / 2);
                imageState.mesh.position.y = (-bounds.top + window.innerHeight / 2 - bounds.height / 2);

                // Optional: Update time uniform if you want animations
                // imageState.mesh.material.uniforms.uTime.value += 0.01;
            })

            controls.update()
            renderer.render(scene, camera)
        }
        animate()

        let ctx = gsap.context(() => {
            ScrollSmoother.create({
                wrapper: "#smooth-wrapper",
                content: "#smooth-content",
                smooth: 1.2,
                effects: true
            });

            // No pinning needed since canvas is fixed outside

            gsap.to(cameraImage.current, {
                scrollTrigger: {
                    trigger: heroDiv.current,
                    start: "top top",
                    end: "bottom top",
                    markers: true,
                    scrub: true
                },
                top: "80vh"
            })
        })

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('mousemove', onMouseMove) // Cleanup mouse listener
            controls.dispose()
            renderer.dispose()
            cancelAnimationFrame(reqAni)
            ctx.revert();

            // Renamed 'o' to 'imageState'
            imageStore.forEach((imageState) => {
                imageState.mesh.geometry.dispose()
                imageState.mesh.material.dispose()
                scene.remove(imageState.mesh)
            })
        }
    }, [manager])

    return (
        <>
            <canvas
                className='fixed top-0 left-0 w-full h-screen z-0 pointer-events-none'
                ref={mountRef}
            ></canvas>

            <div id="smooth-wrapper">
                <div id="smooth-content">

                    <div ref={heroDiv} className="hero relative w-full h-[200vh] top-0 left-0 z-20">
                        <div className="logo">
                            <img className='absolute top-0 z-20 left-0 opacity-0' src="/images/logo.png" alt="" />
                        </div>

                        <div className="camer relative w-[95vw] left-[2.5vw]">
                            <img ref={cameraImage} className='cameraImage absolute object-cover top-[50vh] z-10 left-0 opacity-0' src="/images/camera.png" alt="" />

                            <div className="absolute button -translate-x-1/2 w-auto z-11 h-20 top-[120vh] left-1/2 text-white bg-transparent flex items-center justify-around gap-2">
                                <div className="playButton cursor-pointer w-20 h-20 bg-white rounded-full transition-transform duration-500 ease-in-out hover:scale-90 flex items-center justify-center">
                                    <i className="fa-solid fa-play text-black"></i>
                                </div>
                                <div className="text cursor-default">
                                    <div className="upperText text-[25px] font-bold">Watch Showreel</div>
                                    <div className="lowerText text-[10px] font-bold">2015-23</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sec w-screen h-screen relative top-0 left-0 bg-transparent pointer-events-none z-10"></div>
                </div>
            </div>
        </>
    )
}

export default Home