import { MathUtils } from 'three';

const customRotationData = new Map<THREE.Object3D, { xD: number; yD: number }>();

function moveJointToMousePosition(
	degrees: { x: number; y: number },
	joint: THREE.Object3D<THREE.Object3DEventMap>,
	isMouseIdle: boolean
) {
	const lerpFactor = 0.04; // Example lerp factor

	// Define the initial (resting) rotation degrees for when the mouse is idle.
	const initialDegrees = { x: 0, y: 0 };

	// Retrieve existing custom rotation data, or use defaults if none exists
	const currentRotationData = customRotationData.get(joint) || { xD: 0, yD: 0 };

	// Determine target degrees based on mouse idle state
	const targetDegrees = isMouseIdle ? initialDegrees : degrees;

	// Lerp the custom rotation degrees towards the target
	const newXD = MathUtils.lerp(currentRotationData.xD, targetDegrees.y, lerpFactor);
	const newYD = MathUtils.lerp(currentRotationData.yD, targetDegrees.x, lerpFactor);

	// Update the map with the new values
	customRotationData.set(joint, { xD: newXD, yD: newYD });

	// Apply the lerped degrees as radians to the actual rotation of the object
	joint.rotation.x = MathUtils.degToRad(newXD);
	joint.rotation.y = MathUtils.degToRad(newYD);
}

export default moveJointToMousePosition;
