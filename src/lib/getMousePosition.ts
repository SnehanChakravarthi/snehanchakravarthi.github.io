function getMousePosition(
  state: { mouse: { x: number; y: number } },
  size: { width: number; height: number }
) {
  // Calculate the original mouse position
  const originalX = size.width / 2 + (state.mouse.x * size.width) / 2;
  const originalY = size.height / 2 + (-state.mouse.y * size.height) / 2;

  // Calculate the center of the viewport
  const centerX = size.width / 2;
  const centerY = size.height / 2;

  // Calculate the relative mouse position from the center
  const mouseRelX = originalX - centerX;
  const mouseRelY = originalY - centerY;

  // Normalize the mouse position
  const normalizedX = mouseRelX / centerX;
  const normalizedY = mouseRelY / centerY;

  // Return both original and normalized mouse positions
  return {
    original: { x: originalX, y: originalY },
    normalized: { x: normalizedX, y: normalizedY },
  };
}

export default getMousePosition;
