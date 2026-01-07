import React, { useContext, useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import vertexShader from '../shaders/vertexshader.glsl?raw'
import fragmentShader from '../shaders/fragmentshader.glsl?raw'
import { AssetContext } from '../Context/AssetContext.jsx'
import gsap from 'gsap'
import { ScrollSmoother, ScrollTrigger } from 'gsap/all'

const Home = () => {
    gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
    const cameraImage = useRef(null);
    const heroDiv = useRef()
    const mountRef = useRef()
    const manager = useContext(AssetContext)

    useLayoutEffect(() => {
        // Scene setup
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.z = 5

        // Add a cube
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: {
                    value: 0.,
                }
            }
        })
        const cube = new THREE.Mesh(geometry, material)
        // scene.add(cube)


        const renderer = new THREE.WebGLRenderer({ canvas: mountRef.current, antialias: true, alpha: true })

        // Set minimum pixel ratio to 2
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(window.innerWidth, window.innerHeight)

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
        window.addEventListener('resize', handleResize)


        const texture = new THREE.TextureLoader(manager)
        texture.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/sunny_rose_garden_4k.hdr')
        // OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.enableZoom = false
        // Clock
        const clock = new THREE.Clock()
        // Animation loop
        let reqAni;
        const animate = () => {
            const elapsedTime = clock.getElapsedTime()
            cube.rotation.y = elapsedTime * 0.1
            reqAni = requestAnimationFrame(animate)
            material.uniforms.uTime.value = elapsedTime
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
            return (() => {
                ctx.revert();
            })

        })

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize)
            controls.dispose()
            renderer.dispose()
            geometry.dispose()
            material.dispose()
            cancelAnimationFrame(reqAni)
        }
    }, [manager])

    return (
        <>
            <div id="smooth-wrapper">
                <div id="smooth-content">
                    <canvas className='absolute' ref={mountRef}></canvas>

                    <div ref={heroDiv} className="hero relative w-full h-[200vh] top-0 left-0">
                        <div className="logo">
                            <img className='absolute top-0 z-20 left-0' src="../../public/images/logo.png" alt="" />
                        </div>

                        <div className="camer relative w-[95vw] left-[2.5vw]">
                            <img ref={cameraImage} className='absolute object-cover top-[50vh] z-10 left-0' src="../../public/images/camera.png" alt="" />

                            <div className="absolute button -translate-x-1/2 w-auto z-20 h-20 top-[120vh] left-1/2 text-white flex items-center justify-around gap-2">
                                <div className="playButton cursor-pointer w-20 h-20 bg-white rounded-full  transition-transform duration-500 ease-in-out hover:scale-90 flex items-center justify-center">
                                    <i className="fa-solid fa-play text-black"></i>
                                </div>
                                <div className="text cursor-default">
                                    <div className="upperText text-[25px] font-bold">Watch Showreel</div>
                                    <div className="lowerText text-[10px] font-bold">2015-23</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sec w-screen h-screen relative top-0 left-0 bg-black pointer-events-none" style={{ zIndex: 10 }}></div>
                </div>
            </div>
        </>
    )
}

export default Home
