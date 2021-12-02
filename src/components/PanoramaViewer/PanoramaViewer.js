import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import './PanoramaViewer.css';

export default function PanoramaViewer({ height = 300, file = null, onChange, width = 600 }) {
	const [isGrabbing, setIsGrabbing] = useState(false);

	const [camera, setCamera] = useState(null);
	const [renderer, setRenderer] = useState(null);
	const [scene, setScene] = useState(null);
	const [texture, setTexture] = useState(null);

	const renderContainer = useRef();

	const containerStyle = isGrabbing ? { cursor: 'grabbing' } : { cursor: 'grab' };

	useEffect(() => {
		if (file && renderContainer.current && scene === null && renderer === null) {
			const newScene = new THREE.Scene();
			setScene(newScene);
			
			const newTexture = new THREE.TextureLoader().load(file.localUrl);
			setTexture(newTexture);
			newTexture.mapping = THREE.EquirectangularReflectionMapping;
			newScene.background = newTexture;
			
			const newRenderer = new THREE.WebGLRenderer();
			newRenderer.setSize(width, height);
			setRenderer(newRenderer);
			
			const newCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
			newCamera.position.x = -0.001;
			setCamera(newCamera);

			const controls = new OrbitControls(newCamera, newRenderer.domElement);
			if (typeof onChange === 'function') {
				controls.addEventListener('change', () => onChange(newCamera));
			}

			function animate() {
				requestAnimationFrame(animate);

				newRenderer.render(newScene, newCamera);
			}
			animate();

			renderContainer.current.appendChild(newRenderer.domElement);
		}
	}, [camera, file, height, onChange, renderer, scene, texture, width]);

	if (!file) {
		return null;
	}

	const idPostfix = file.localUrl.replace(`blob:${window.location.origin}/`, '')

	return (
		<div
			className="render-container"
			id={`render-container_${idPostfix}`}
			onMouseDown={() => setIsGrabbing(true)}
			onMouseUp={() => setIsGrabbing(false)}
			ref={renderContainer}
			style={containerStyle} 
		/>
	);
}
