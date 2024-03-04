import { MathUtils } from 'three';

const eyeMorphTargetsData = new Map<string, number>(); // For storing previous influences

function animateEyeballs(
	avatarMesh: React.RefObject<
		THREE.SkinnedMesh<
			THREE.BufferGeometry<THREE.NormalBufferAttributes>,
			THREE.Material | THREE.Material[],
			THREE.Object3DEventMap
		>
	>,
	normalizedMousePosition: { x: number; y: number },
	isMouseIdle: boolean
) {
	if (!avatarMesh.current || !avatarMesh.current.morphTargetDictionary) return;

	const lerpFactor = 0.1; // Adjust for desired smoothness
	const morphTargetDict = avatarMesh.current.morphTargetDictionary;
	const morphTargetInfluences = avatarMesh.current.morphTargetInfluences;
	const { x: normalizedX, y: normalizedY } = normalizedMousePosition;

	// Logic for setting or resetting eye morph targets
	const targets = [
		{ name: 'eyeLookUpLeft', influence: Math.min(1, Math.max(0, normalizedY)) },
		{ name: 'eyeLookUpRight', influence: Math.min(1, Math.max(0, normalizedY)) },
		{ name: 'eyeLookDownLeft', influence: Math.min(1, Math.max(0, -normalizedY)) },
		{ name: 'eyeLookDownRight', influence: Math.min(1, Math.max(0, -normalizedY)) },
		{ name: 'eyeLookInLeft', influence: Math.min(1, Math.max(0, -normalizedX)) },
		{ name: 'eyeLookInRight', influence: Math.min(1, Math.max(0, normalizedX)) },
		{ name: 'eyeLookOutLeft', influence: Math.min(1, Math.max(0, normalizedX)) },
		{ name: 'eyeLookOutRight', influence: Math.min(1, Math.max(0, -normalizedX)) }
	];

	targets.forEach((target) => {
		const index = morphTargetDict[target.name];
		if (typeof index === 'number' && morphTargetInfluences) {
			const storedInfluence = eyeMorphTargetsData.get(target.name) || 0;
			const targetInfluence = isMouseIdle ? 0 : target.influence;
			const newInfluence = MathUtils.lerp(storedInfluence, targetInfluence, lerpFactor);

			morphTargetInfluences[index] = newInfluence;
			eyeMorphTargetsData.set(target.name, newInfluence);
		}
	});
}

export default animateEyeballs;
