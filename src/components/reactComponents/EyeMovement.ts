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

  // When the mouse is idle, reset eye positions to neutral
  if (isMouseIdle) {
    resetEyeMorphTargetsToNeutral(avatarMesh);
    return;
  }

  // Existing logic to set eye morph targets based on mouse position
  const { x: normalizedX, y: normalizedY } = normalizedMousePosition;
  setEyeMorphTarget(avatarMesh, 'eyeLookUpLeft', Math.max(0, -normalizedY));
  setEyeMorphTarget(avatarMesh, 'eyeLookUpRight', Math.max(0, -normalizedY));
  setEyeMorphTarget(avatarMesh, 'eyeLookDownLeft', Math.max(0, normalizedY));
  setEyeMorphTarget(avatarMesh, 'eyeLookDownRight', Math.max(0, normalizedY));

  setEyeMorphTarget(avatarMesh, 'eyeLookInLeft', Math.max(0, -normalizedX));
  setEyeMorphTarget(avatarMesh, 'eyeLookInRight', Math.max(0, normalizedX));
  setEyeMorphTarget(avatarMesh, 'eyeLookOutLeft', Math.max(0, normalizedX));
  setEyeMorphTarget(avatarMesh, 'eyeLookOutRight', Math.max(0, -normalizedX));
}

function setEyeMorphTarget(
  avatarMesh: React.RefObject<
    THREE.SkinnedMesh<
      THREE.BufferGeometry<THREE.NormalBufferAttributes>,
      THREE.Material | THREE.Material[],
      THREE.Object3DEventMap
    >
  >,
  targetName: string,
  influence: number
) {
  if (avatarMesh.current && avatarMesh.current.morphTargetDictionary) {
    const index = avatarMesh.current.morphTargetDictionary[targetName];
    if (typeof index === 'number' && avatarMesh.current.morphTargetInfluences) {
      avatarMesh.current.morphTargetInfluences[index] = influence;
    }
  }
}

function resetEyeMorphTargetsToNeutral(
  avatarMesh: React.RefObject<
    THREE.SkinnedMesh<
      THREE.BufferGeometry<THREE.NormalBufferAttributes>,
      THREE.Material | THREE.Material[],
      THREE.Object3DEventMap
    >
  >
) {
  // Reset all relevant morph targets to 0 to achieve a neutral expression
  const targetsToReset = [
    'eyeLookUpLeft',
    'eyeLookUpRight',
    'eyeLookDownLeft',
    'eyeLookDownRight',
    'eyeLookInLeft',
    'eyeLookInRight',
    'eyeLookOutLeft',
    'eyeLookOutRight',
  ];

  targetsToReset.forEach((target) => setEyeMorphTarget(avatarMesh, target, 0));
}

export default animateEyeballs;
