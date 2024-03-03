'use client';

import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PerspectiveCamera, useGLTF, useTexture } from '@react-three/drei';
// import { EffectComposer, N8AO, SMAA } from '@react-three/postprocessing';
import { BallCollider, Physics, RigidBody, CylinderCollider } from '@react-three/rapier';
import MatrixEffect from './MatrixEffect';

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

function Bauble({
	texture,
	scale,
	vec = new THREE.Vector3(),
	r = THREE.MathUtils.randFloatSpread
}) {
	const api = useRef();

	const baubleMaterial = new THREE.MeshStandardMaterial({
		map: texture,
		metalness: 0.8,
		roughness: 0.7,
		envMapIntensity: 1
	});

	useFrame((state, delta) => {
		delta = Math.min(0.1, delta);
		if (api.current) {
			api.current.applyImpulse(
				vec
					.copy(api.current.translation())
					.normalize()
					.multiply({
						x: -50 * delta * scale,
						y: -200 * delta * scale,
						z: -500 * delta * scale
					})
			);
		}
	});

	return (
		<>
			<RigidBody
				linearDamping={0.75}
				angularDamping={0.15}
				friction={0.2}
				position={[r(40), r(40), r(40) - 10]}
				ref={api}
				colliders={false}
				dispose={null}
			>
				<BallCollider args={[scale]} />

				<mesh
					castShadow
					receiveShadow
					scale={new THREE.Vector3().setScalar(scale)}
					geometry={sphereGeometry}
					material={baubleMaterial}
				/>
			</RigidBody>
		</>
	);
}

function Baubles() {
	const scales = [0.65, 0.75, 0.65, 0.8, 0.7, 0.55, 0.55, 0.5, 0.65, 0.7, 0.55, 0.55, 0.6, 0.6, 0.6];

	const [
		htmlTexture,
		jsTexture,
		cssTexture,
		reactTexture,
		blenderTexture,
		threejsTexture,
		nodeTexture,
		gitTexture,
		figmaTexture,
		nextjsTexture,
		npmTexture,
		webpackTexture,
		adobeTexture,
		tailwindTexture,
		solidworksTexture
	] = useTexture([
		'/skills/html.png',
		'/skills/js.png',
		'/skills/css.png',
		'/skills/react.png',
		'/skills/blender.png',
		'/skills/threejs.png',
		'/skills/node.png',
		'/skills/git.png',
		'/skills/figma.png',
		'/skills/nextjs.png',
		'/skills/npm.png',
		'/skills/webpack.png',
		'/skills/adobe.png',
		'/skills/tailwind.png',
		'/skills/solidworks.png'
	]);

	const textures = [
		htmlTexture,
		jsTexture,
		cssTexture,
		reactTexture,
		blenderTexture,
		threejsTexture,
		nodeTexture,
		gitTexture,
		figmaTexture,
		nextjsTexture,
		npmTexture,
		webpackTexture,
		adobeTexture,
		tailwindTexture,
		solidworksTexture
	];

	return (
		<>
			{[...Array(textures.length)].map((_, i) => (
				<Bauble key={i} texture={textures[i]} scale={scales[i]} />
			))}
		</>
	);
}

function Pointer({ vec = new THREE.Vector3() }) {
	const ref = useRef();
	useFrame(({ mouse, viewport }) => {
		vec.lerp(
			{
				x: (mouse.x * viewport.width) / 2,
				y: (mouse.y * viewport.height) / 2,
				z: 0
			},
			0.2
		);
		ref.current?.setNextKinematicTranslation(vec);
	});
	return (
		<RigidBody position={[100, 100, 100]} type="kinematicPosition" colliders={false} ref={ref}>
			<BallCollider args={[0.5]} />
		</RigidBody>
	);
}

function SkillBalls() {
	return (
		<div className="h-full w-full">
			<Canvas
				shadows
				gl={{ stencil: false, depth: false, antialias: false }}
				camera={{ position: [5, 0, 18], fov: 22, near: 1, far: 100 }}
				onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
			>
				{/* <PerspectiveCamera makeDefault position={[0.3, 0, 7]} fov={22} near={1} far={100} /> */}
				<directionalLight position={[0, 3, 4]} intensity={1} castShadow />
				<Physics gravity={[5, 0, 0]}>
					<Pointer />
					<Float speed={1} rotationIntensity={1} floatIntensity={1} floatingRange={[0, 0.5]}>
						<Baubles />
					</Float>
				</Physics>
				<Environment preset="lobby" />
				{/* <EffectComposer disableNormalPass multisampling={0}>
				<N8AO halfRes color="black" aoRadius={2} intensity={2} aoSamples={6} denoiseSamples={4} />
				<SMAA />
			</EffectComposer> */}
			</Canvas>
			<MatrixEffect />
		</div>
	);
}

export default SkillBalls;
