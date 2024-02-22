function getMouseDegreesNormalized(normalizedX: number, normalizedY: number, degreeLimit: number) {
	// Use normalizedX directly for degree calculation
	let dx = normalizedX * degreeLimit; // normalizedX is [-1, 1], direct scale to degreeLimit

	// Adjust sign here by removing the negation for normalizedY
	let dy = -normalizedY * degreeLimit * 0.5; // Half degreeLimit for up/down, use positive normalizedY

	// Clamp dx and dy to the [-degreeLimit, degreeLimit] range to ensure they don't exceed boundaries
	dx = Math.max(-degreeLimit, Math.min(degreeLimit, dx));
	dy = Math.max(-degreeLimit * 0.5, Math.min(degreeLimit * 0.5, dy)); // Ensure dy is clamped correctly, considering the halved limit for vertical movement

	return { x: dx, y: dy };
}

export default getMouseDegreesNormalized;
