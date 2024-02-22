import { useRef } from 'react';
import useMorphTargetAnimation from './ShapeKeyAnim';

function useMultipleMorphTargetAnimations(
	avatarMesh: React.RefObject<any>,
	animations: { name: any; influence: any; speed: any; duration: any }[]
) {
	// This ref will store the start functions for each animation
	const startFunctionsRef = useRef<{ [key: string]: any }>({});

	animations.forEach(({ name, influence, speed, duration }) => {
		// Dynamically generate the start function name based on the morph target name
		const startFunctionName = `startAnimation${name.replace(/[^a-zA-Z0-9]/g, '')}`;

		// Call useMorphTargetAnimation for each animation and store the returned start function
		startFunctionsRef.current[startFunctionName] = useMorphTargetAnimation(
			avatarMesh,
			name,
			influence,
			speed,
			duration
		);
	});

	// Return an object containing all the start functions
	return startFunctionsRef.current;
}

export default useMultipleMorphTargetAnimations;
