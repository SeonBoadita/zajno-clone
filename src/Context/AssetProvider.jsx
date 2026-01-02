import React, { useState, useEffect, useMemo } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AssetContext } from './AssetContext';
import Loader from '../components/Loader';
import * as THREE from 'three';
export const AssetProvider = ({ children }) => {
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const manager = useMemo(() => new THREE.LoadingManager(), [])

    useEffect(() => {
        manager.onProgress = (url, itemsLoaded, itemsTotal) => {
            setProgress((itemsLoaded / itemsTotal) * 100);
        }
        let timer;
        manager.onLoad = (() => {
            timer = setTimeout(() => {
                setLoaded(true);
            }, 1000)
        })

        return (() => {
            if (loaded == true) clearTimeout(timer)
        })
    }, [manager, loaded]);

    return (
        <>
            {!loaded && <Loader progress={progress} />}
            <AssetContext.Provider value={manager}>
                <div style={{ opacity: loaded ? 1 : 0, transition: 'all 1s ease' }}>
                    {children}
                </div>
            </AssetContext.Provider>
        </>

    );
};