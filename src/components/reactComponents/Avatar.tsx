import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Model } from './Model';
import { Suspense } from 'react';
import Loader from './Loader';
import { Perf } from 'r3f-perf';

const Avatar = () => {
	const canvasContainerRef = useRef<HTMLDivElement>(null);

	const [isOnScreen, setIsOnScreen] = useState(false);

	useEffect(() => {
		const container = canvasContainerRef.current;
		if (!container) return;

		const intersectionObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				setIsOnScreen(entry.isIntersecting);
			});
		});

		intersectionObserver.observe(container);

		return () => {
			intersectionObserver.disconnect();
		};
	}, []);

	return (
		<div className="h-screen w-full" ref={canvasContainerRef}>
			<Canvas
				camera={{
					fov: 4,
					near: 0.1,
					far: 1000,
					position: new THREE.Vector3(0, -2, 17)
				}}
				dpr={[1, 2]}
				frameloop={isOnScreen ? 'always' : 'never'}
			>
				{/* <Perf /> */}
				<Suspense fallback={<Loader />}>
					<Model scale={1} position={[0, -1.7, 0]} />
					<Environment preset="apartment" />
				</Suspense>
			</Canvas>
		</div>
	);
};

export default Avatar;
