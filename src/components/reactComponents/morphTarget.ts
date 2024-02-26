import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, Mesh } from 'three';

// Define a type for the animation configuration
type AnimationConfig = {
	name: string;
	influence: number;
	speed: number;
	duration: number;
};

// Define a type for the function that manages a single animation
type AnimationFunction = (elapsedTime: number) => void;

// Function to start a specific animation based on the configuration
const startAnimation = (
	avatarMesh: React.RefObject<Mesh>,
	config: AnimationConfig
): AnimationFunction => {
	const { name, influence, speed, duration } = config;
	const animationStart = performance.now();
	let phase: 'forward' | 'waiting' | 'reverse' | 'none' = 'forward';

	return (elapsedTime: number) => {
		if (!avatarMesh.current) return;

		const morphTargetIndex = avatarMesh.current.morphTargetDictionary?.[name];
		if (morphTargetIndex === undefined) return; // Skip if the morph target doesn't exist

		const animationElapsedTime = (elapsedTime - animationStart) / 1000; // convert ms to seconds
		let progress: number;

		switch (phase) {
			case 'forward':
				if (animationElapsedTime <= speed) {
					progress = Math.min(animationElapsedTime / speed, 1);
					avatarMesh.current.morphTargetInfluences[morphTargetIndex] = MathUtils.lerp(
						0,
						influence,
						progress
					);
				} else {
					phase = 'waiting';
				}
				break;
			case 'waiting':
				if (animationElapsedTime <= speed + duration) {
					// Keep the influence steady during the waiting period
				} else {
					phase = 'reverse';
				}
				break;
			case 'reverse':
				const reverseProgressTime = animationElapsedTime - speed - duration;
				if (reverseProgressTime <= speed) {
					progress = 1 - Math.min(reverseProgressTime / speed, 1);
					avatarMesh.current.morphTargetInfluences[morphTargetIndex] = MathUtils.lerp(
						influence,
						0,
						progress
					);
				} else {
					phase = 'none'; // Animation ends
				}
				break;
		}
	};
};

// Use this function to orchestrate multiple animations
function useMultipleMorphTargetAnimations(
	avatarMesh: React.RefObject<Mesh>,
	animations: AnimationConfig[]
) {
	const animationFunctions = useRef<AnimationFunction[]>([]);

	useEffect(() => {
		// Initialize all animations
		animations.forEach((config) => {
			animationFunctions.current.push(startAnimation(avatarMesh, config));
		});

		return () => {
			animationFunctions.current = []; // Cleanup
		};
	}, [animations, avatarMesh]);

	useFrame((state, delta) => {
		const elapsedTime = state.clock.getElapsedTime() * 1000; // convert to milliseconds
		animationFunctions.current.forEach((func) => func(elapsedTime));
	});
}
