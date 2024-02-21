import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { SkinnedMesh } from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

import type { GLTF } from 'three-stdlib';

import useBlink from './BlinkLogic';
import useMorphTargetAnimation from './ShapeKeyAnim';
import getMouseDegreesNormalized from '../../lib/getMouseDegreesNormalized';
import getMousePosition from '../../lib/getMousePosition';
import animateEyeballs from './EyeMovement';
import moveJointToMousePosition from './MoveJoint';

type GLTFResult = GLTF & {
	nodes: {
		Wolf3D_Avatar001: THREE.SkinnedMesh;
		Wolf3D_Body001: THREE.SkinnedMesh;
		Wolf3D_Outfit_Top001: THREE.SkinnedMesh;
		Hips: THREE.Bone;
		Ctrl_Master: THREE.Bone;
		Ctrl_ArmPole_IK_Left: THREE.Bone;
		Ctrl_Hand_IK_Left: THREE.Bone;
		Ctrl_ArmPole_IK_Right: THREE.Bone;
		Ctrl_Hand_IK_Right: THREE.Bone;
		Ctrl_Foot_IK_Left: THREE.Bone;
		Ctrl_LegPole_IK_Left: THREE.Bone;
		Ctrl_Foot_IK_Right: THREE.Bone;
		Ctrl_LegPole_IK_Right: THREE.Bone;
	};
	materials: {
		Wolf3D_Avatar: THREE.MeshStandardMaterial;
		Wolf3D_Body: THREE.MeshStandardMaterial;
		Wolf3D_Outfit_Top: THREE.MeshStandardMaterial;
	};
};

type ActionName =
	| 'idle_eyes_2'
	| 'StretchAction'
	| 'HiAction'
	| 'HappyIdle'
	| 'Stretch2'
	| 'HeadStretch'
	| 'StandingIdle'
	| 'OfensiveIdle'
	| 'Looking'
	| 'Dance';
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

const actions = {
	heavyActions: [
		{ action: 'StretchAction', repetitions: 1 },
		{ action: 'Stretch2', repetitions: 1 },
		{ action: 'HeadStretch', repetitions: 1 },
		{ action: 'Looking', repetitions: 1 },
		{ action: 'Dance', repetitions: 2 }
	],
	lightActions: [
		{ action: 'HappyIdle', repetitions: 3 },
		{ action: 'StandingIdle', repetitions: 1 },
		{ action: 'OfensiveIdle', repetitions: 1 }
	]
};

interface ActionDetail {
	action: string;
	repetitions: number;
}

interface Actions {
	heavyActions: ActionDetail[];
	lightActions: ActionDetail[];
}

export function Model(props: JSX.IntrinsicElements['group']) {
	const avatarMesh = useRef<SkinnedMesh>(null);
	const group = useRef(null!);
	const { size } = useThree();
	const [isMouseIdle, setIsMouseIdle] = useState(false);
	const lastMousePosition = useRef({ x: 0, y: 0 });
	const mouseIdleTimeoutRef = useRef<number | null>(null);

	const idleTimeoutDuration = 5000; // 5 seconds

	const { nodes, materials, animations } = useGLTF('/cad/snehanReadyPlayerOne.glb') as GLTFResult;
	//   const { actions } = useAnimations(animations, group);
	//   console.log(nodes.Hips, materials, animations);
	useBlink(avatarMesh);

	const mixerRef = useRef<THREE.AnimationMixer | null>(null);
	const mixerRef2 = useRef<THREE.AnimationMixer | null>(null);

	useEffect(() => {
		if (animations.length > 0) {
			mixerRef2.current = new THREE.AnimationMixer(nodes.Hips);
			const eyeAction = animations.find((clip) => clip.name === 'idle_eyes_2');
			if (eyeAction && mixerRef2.current) {
				const action = mixerRef2.current.clipAction(eyeAction);
				action.reset();
				action.setLoop(THREE.LoopRepeat, Infinity);
				action.play();
			}
			startAnimation();
		}
		return () => {
			if (mixerRef2.current) {
				mixerRef2.current.stopAllAction();
			}
		};
	}, [animations]);

	useEffect(() => {
		if (animations.length > 0 && nodes.Hips) {
			mixerRef.current = new THREE.AnimationMixer(nodes.Hips);

			let previousAction: THREE.AnimationAction | null = null;

			const playAnimation = (
				actionClip: THREE.AnimationClip,
				repetitions: number,
				onFinishCallback?: () => void
			) => {
				if (!mixerRef.current) return null;
				const action = mixerRef.current.clipAction(actionClip);
				action.reset();
				action.setLoop(THREE.LoopRepeat, repetitions);
				action.clampWhenFinished = true;

				if (previousAction) {
					const duration = 1.2; // Duration of the crossfade (in seconds)
					previousAction.crossFadeTo(action, duration, true);
				}

				action.play();
				previousAction = action; // Update the previous action

				if (onFinishCallback) {
					const finishedListener = (e: any) => {
						if (e.action === action) {
							mixerRef.current?.removeEventListener('finished', finishedListener);
							onFinishCallback();
						}
					};

					mixerRef.current.addEventListener('finished', finishedListener);
				}
				return action;
			};

			const transitionToRandomAction = (
				actionGroup: keyof Actions,
				onFinishCallback?: () => void
			) => {
				const actionDetails = actions[actionGroup];
				const randomIndex = Math.floor(Math.random() * actionDetails.length);
				const { action, repetitions } = actionDetails[randomIndex];
				const actionClip = animations.find((clip) => clip.name === action);
				if (actionClip) {
					playAnimation(actionClip, repetitions, () => {
						// Alternate between action groups
						const nextGroup = actionGroup === 'heavyActions' ? 'lightActions' : 'heavyActions';
						transitionToRandomAction(nextGroup);
					});
				}
			};

			// Start the sequence with "HiAction"
			const hiActionClip = animations.find((clip) => clip.name === 'HiAction');
			if (hiActionClip) {
				playAnimation(hiActionClip, 1, () => transitionToRandomAction('lightActions'));
			}

			// Cleanup
			return () => {
				if (mixerRef.current) {
					mixerRef.current.stopAllAction();
				}
			};
		}
	}, [animations, nodes.Hips]);

	const startAnimation = useMorphTargetAnimation(avatarMesh, 'mouthSmile', 0.8, 1);

	useEffect(() => {
		return () => {
			if (mouseIdleTimeoutRef.current !== null) {
				clearTimeout(mouseIdleTimeoutRef.current);
			}
		};
	}, []);

	useFrame((state, delta) => {
		mixerRef.current?.update(delta);
		mixerRef2.current?.update(delta);

		// Get both original and normalized mouse positions
		const {
			original: mousePosition,
			normalized: { x: normalizedX, y: normalizedY }
		} = getMousePosition(state, size);

		if (
			normalizedX !== lastMousePosition.current.x ||
			normalizedY !== lastMousePosition.current.y
		) {
			// Mouse has moved, reset idle state and timeout
			if (isMouseIdle) setIsMouseIdle(false);
			if (mouseIdleTimeoutRef.current !== null) {
				clearTimeout(mouseIdleTimeoutRef.current);
			}
			mouseIdleTimeoutRef.current = setTimeout(() => {
				setIsMouseIdle(true);
			}, idleTimeoutDuration);

			lastMousePosition.current = { x: normalizedX, y: normalizedY };
		}

		// Use the normalized mouse positions for your calculations
		animateEyeballs(avatarMesh, { x: normalizedX, y: normalizedY }, isMouseIdle);
		updateJointPositions(normalizedX, normalizedY);
	});

	function updateJointPositions(normalizedX: number, normalizedY: number) {
		const degreeLimits = [20, 12, 10, 5];
		['Head', 'Neck', 'Spine2', 'Spine1'].forEach((nodeName, index) => {
			const degrees = getMouseDegreesNormalized(normalizedX, normalizedY, degreeLimits[index]);
			moveJoint(nodeName, degrees);
		});
	}

	function moveJoint(nodeName: string, degrees: { x: number; y: number }) {
		const node = nodes[nodeName as keyof typeof nodes] as THREE.Object3D | undefined;
		if (node) {
			moveJointToMousePosition(degrees, node, isMouseIdle);
		}
	}

	return (
		<group ref={group} {...props} dispose={null}>
			<group name="Scene">
				<group name="Avatar" userData={{ name: 'Avatar' }}>
					<skinnedMesh
						name="Wolf3D_Avatar001"
						ref={avatarMesh}
						geometry={nodes.Wolf3D_Avatar001.geometry}
						material={materials.Wolf3D_Avatar}
						skeleton={nodes.Wolf3D_Avatar001.skeleton}
						morphTargetDictionary={nodes.Wolf3D_Avatar001.morphTargetDictionary}
						morphTargetInfluences={nodes.Wolf3D_Avatar001.morphTargetInfluences}
						userData={{
							targetNames: [
								'mouthOpen',
								'viseme_sil',
								'viseme_PP',
								'viseme_FF',
								'viseme_TH',
								'viseme_DD',
								'viseme_kk',
								'viseme_CH',
								'viseme_SS',
								'viseme_nn',
								'viseme_RR',
								'viseme_aa',
								'viseme_E',
								'viseme_I',
								'viseme_O',
								'viseme_U',
								'mouthSmile',
								'browDownLeft',
								'browDownRight',
								'browInnerUp',
								'browOuterUpLeft',
								'browOuterUpRight',
								'eyeSquintLeft',
								'eyeSquintRight',
								'eyeWideLeft',
								'eyeWideRight',
								'jawForward',
								'jawLeft',
								'jawRight',
								'mouthFrownLeft',
								'mouthFrownRight',
								'mouthPucker',
								'mouthShrugLower',
								'mouthShrugUpper',
								'noseSneerLeft',
								'noseSneerRight',
								'mouthLowerDownLeft',
								'mouthLowerDownRight',
								'mouthLeft',
								'mouthRight',
								'eyeLookDownLeft',
								'eyeLookDownRight',
								'eyeLookUpLeft',
								'eyeLookUpRight',
								'eyeLookInLeft',
								'eyeLookInRight',
								'eyeLookOutLeft',
								'eyeLookOutRight',
								'cheekPuff',
								'cheekSquintLeft',
								'cheekSquintRight',
								'jawOpen',
								'mouthClose',
								'mouthFunnel',
								'mouthDimpleLeft',
								'mouthDimpleRight',
								'mouthStretchLeft',
								'mouthStretchRight',
								'mouthRollLower',
								'mouthRollUpper',
								'mouthPressLeft',
								'mouthPressRight',
								'mouthUpperUpLeft',
								'mouthUpperUpRight',
								'mouthSmileLeft',
								'mouthSmileRight',
								'tongueOut',
								'eyeBlinkLeft',
								'eyeBlinkRight',
								'eyesClosed',
								'eyesLookUp',
								'eyesLookDown'
							],
							name: 'Wolf3D_Avatar.001'
						}}
					/>
					<skinnedMesh
						name="Wolf3D_Body001"
						geometry={nodes.Wolf3D_Body001.geometry}
						material={materials.Wolf3D_Body}
						skeleton={nodes.Wolf3D_Body001.skeleton}
						morphTargetDictionary={nodes.Wolf3D_Body001.morphTargetDictionary}
						morphTargetInfluences={nodes.Wolf3D_Body001.morphTargetInfluences}
						userData={{
							targetNames: ['male', 'female'],
							name: 'Wolf3D_Body.001'
						}}
					/>
					<skinnedMesh
						name="Wolf3D_Outfit_Top001"
						geometry={nodes.Wolf3D_Outfit_Top001.geometry}
						material={materials.Wolf3D_Outfit_Top}
						skeleton={nodes.Wolf3D_Outfit_Top001.skeleton}
						morphTargetDictionary={nodes.Wolf3D_Outfit_Top001.morphTargetDictionary}
						morphTargetInfluences={nodes.Wolf3D_Outfit_Top001.morphTargetInfluences}
						userData={{
							targetNames: ['male', 'female'],
							name: 'Wolf3D_Outfit_Top.001'
						}}
					/>
					<primitive object={nodes.Hips} />
					<primitive object={nodes.Ctrl_Master} />
					<primitive object={nodes.Ctrl_ArmPole_IK_Left} />
					<primitive object={nodes.Ctrl_Hand_IK_Left} />
					<primitive object={nodes.Ctrl_ArmPole_IK_Right} />
					<primitive object={nodes.Ctrl_Hand_IK_Right} />
					<primitive object={nodes.Ctrl_Foot_IK_Left} />
					<primitive object={nodes.Ctrl_LegPole_IK_Left} />
					<primitive object={nodes.Ctrl_Foot_IK_Right} />
					<primitive object={nodes.Ctrl_LegPole_IK_Right} />
				</group>
			</group>
		</group>
	);
}

useGLTF.preload('/cad/snehanReadyPlayerOne.glb');
