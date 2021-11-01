import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import './PanoramaViewer.css';

function cameraChangeHandler(cam) {
	// North is -90 (-1.57) on the Y

	//let { rotation: { _x: x, _y: y, _z: z } } = cam;

	//[x, y, z] = [x * (180 / Math.PI), y * (180 / Math.PI), z * (180 / Math.PI)];
}

export default function PanoramaViewer({ height = 150, image = null, width = 300 }) {
	const [isGrabbing, setIsGrabbing] = useState(false);

	const [camera, setCamera] = useState(null);
	const [renderer, setRenderer] = useState(null);
	const [scene, setScene] = useState(null);
	const [texture, setTexture] = useState(null);

	const renderContainer = useRef();

	const containerStyle = isGrabbing ? { cursor: 'grabbing' } : { cursor: 'grab' };

	useEffect(() => {
		if (image && renderContainer.current && scene === null && renderer === null) {
			const newScene = new THREE.Scene();
			setScene(newScene);
			
			const newTexture = new THREE.TextureLoader().load(image);
			setTexture(newTexture);
			newTexture.mapping = 303;
			
			newScene.background = newTexture;
			
			const newCamera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
			newCamera.position.x = -0.001;
			setCamera(newCamera);

			const newRenderer = new THREE.WebGLRenderer();
			newRenderer.setSize(width, height);
			setRenderer(newRenderer);

			const controls = new OrbitControls(newCamera, newRenderer.domElement);
			controls.addEventListener('change', () => cameraChangeHandler(newCamera));

			function animate() {
				requestAnimationFrame(animate);

				newRenderer.render(newScene, newCamera);
			}
			animate();

			renderContainer.current.appendChild(newRenderer.domElement);
		}
	}, [camera, height, image, renderer, scene, texture, width]);

	if (!image) {
		return null;
	}

	return (
		<div
			id="render-container"
			onMouseDown={() => setIsGrabbing(true)}
			onMouseUp={() => setIsGrabbing(false)}
			ref={renderContainer}
			style={containerStyle} 
		/>
	);
}
