import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Model } from './Model';
import { Suspense } from 'react';
import Loader from './Loader';
// import { Loader } from '@react-three/drei';

const Avatar = () => {
	return (
		<div className="h-full w-full">
			<Canvas
				camera={{
					fov: 4,
					near: 0.1,
					far: 1000,
					position: new THREE.Vector3(0, 0, 15)
				}}
			>
				<Suspense fallback={<Loader />}>
					{/* <ambientLight intensity={1} /> */}
					{/* <pointLight position={[10, 10, 10]} /> */}
					<Model scale={1} position={[0, -1.7, 0]} />
					<Environment preset="apartment" />
				</Suspense>
			</Canvas>
			{/* <Loader
				containerStyles={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					width: '100%',
					height: '100%',
					backgroundColor: 'rgba(0, 0, 0, 0)', // Semi-transparent overlay
					position: 'absolute',
					top: 0,
					left: 0,
					zIndex: 10 // Ensure it's above all other content
				}}
				innerStyles={{
					padding: '0px',
					borderRadius: '2px',
					backgroundColor: '#fff'
				}}
				barStyles={{
					innerWidth: '100%',
					height: '4px',
					backgroundColor: '#007bff',
					width: '0%'
				}}
				dataStyles={{
					marginTop: '10px',
					textAlign: 'center',
					fontWeight: 'bold'
				}}
				dataInterpolation={(p) => `Loading ${p.toFixed(2)}%`}
			/> */}
		</div>
	);
};

export default Avatar;
