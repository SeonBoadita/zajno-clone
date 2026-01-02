import React, { useContext, useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import vertexShader from '../shaders/vertexshader.glsl'
import fragmentShader from '../shaders/fragmentshader.glsl'
import { AssetProvider } from '../Context/AssetProvider.jsx'
const MainScene = () => {
    const mountRef = useRef()
    const manager = useContext(AssetProvider)

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
        scene.add(cube)


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
            <canvas ref={mountRef} style={{ width: '100vw', height: '100vh' }}></canvas>
            <div className="sec w-screen h-full bg-orange-500"></div>
        </>
    )
}

export default MainScene
