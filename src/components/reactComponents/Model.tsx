import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { SkinnedMesh } from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

import type { GLTF } from 'three-stdlib';

import useBlink from './BlinkLogic';
import useMorphTargetAnimation from './ShapeKeyAnim';
import getMouseDegreesNormalized from '../../lib/getMouseDegreesNormalized';
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

interface ActionConfig {
	action: string;
	repetitions: number;
}

interface ActionsGroup {
	heavyActions: ActionConfig[];
	lightActions: ActionConfig[];
}
const actionsGroup: ActionsGroup = {
	heavyActions: [
		{ action: 'StretchAction', repetitions: 1 },
		{ action: 'Stretch2', repetitions: 1 },
		{ action: 'HeadStretch', repetitions: 1 },
		{ action: 'Looking', repetitions: 1 },
		{ action: 'Dance', repetitions: 2 },
		{ action: 'HiAction', repetitions: 1 }
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
	const { pointer } = useThree();
	let normalizedX = 0;
	let normalizedY = 0;
	const [isMouseIdle, setIsMouseIdle] = useState(false);
	const lastMousePosition = useRef({ x: 0, y: 0 });

	const mouseIdleTimeoutRef = useRef<number | null>(null);

	const idleTimeoutDuration = 1000;
	const { nodes, materials, animations } = useGLTF('/cad/snehanReadyPlayerOne-v1.glb') as GLTFResult;

	useBlink(avatarMesh);

	const [currentClipName, setCurrentClipName] = useState('');

	const hiAction1 = useMorphTargetAnimation(avatarMesh, 'mouthSmile', 0.5, 0.5, 4);
	const hiAction2 = useMorphTargetAnimation(avatarMesh, 'mouthDimpleLeft', 0.7, 0.6, 4);
	const hiAction3 = useMorphTargetAnimation(avatarMesh, 'mouthDimpleRight', 1, 0.6, 4);
	const hiAction4 = useMorphTargetAnimation(avatarMesh, 'mouthOpen', 0.5, 1, 1);
	const hiAction5 = useMorphTargetAnimation(avatarMesh, 'eyeWideLeft', 0.6, 1, 4);
	const hiAction6 = useMorphTargetAnimation(avatarMesh, 'eyeWideRight', 0.6, 1, 4);
	const hiAction7 = useMorphTargetAnimation(avatarMesh, 'browInnerUp', 0.5, 0.5, 4);

	const happyIdle1 = useMorphTargetAnimation(avatarMesh, 'browOuterUpLeft', 0.4, 0.5, 11);
	const happyIdle2 = useMorphTargetAnimation(avatarMesh, 'mouthPucker', 0.6, 0.6, 11);
	const happyIdle3 = useMorphTargetAnimation(avatarMesh, 'mouthSmileRight', 0.4, 0.5, 11);

	const lookingAction1 = useMorphTargetAnimation(avatarMesh, 'browDownLeft', 0.3, 0.5, 4);
	const lookingAction2 = useMorphTargetAnimation(avatarMesh, 'browDownRight', 0.6, 0.5, 4);
	const lookingAction3 = useMorphTargetAnimation(avatarMesh, 'eyeSquintLeft', 0.3, 0.5, 4);
	const lookingAction4 = useMorphTargetAnimation(avatarMesh, 'eyeSquintRight', 0.6, 0.5, 4);

	const offensiveIdle1 = useMorphTargetAnimation(avatarMesh, 'mouthShrugLower', 0.6, 0.5, 9);
	const offensiveIdle2 = useMorphTargetAnimation(avatarMesh, 'mouthPressLeft', 0.7, 0.5, 9);

	const HeadStretch1 = useMorphTargetAnimation(avatarMesh, 'cheekPuff', 1, 1, 1);

	useEffect(() => {
		if (currentClipName === 'HiAction') {
			hiAction1();
			hiAction2();
			hiAction3();
			hiAction4();
			hiAction5();
			hiAction6();
			hiAction7();
		} else if (currentClipName === 'HappyIdle') {
			happyIdle1();
			happyIdle2();
			happyIdle3();
		} else if (currentClipName === 'Looking') {
			lookingAction1();
			lookingAction2();
			lookingAction3();
			lookingAction4();
		} else if (currentClipName === 'standingIdle') {
			hiAction7();
		} else if (currentClipName === 'OfensiveIdle') {
			offensiveIdle1();
			hiAction1();
			offensiveIdle2();
		} else if (currentClipName === 'Dance') {
			hiAction4();
			hiAction1();
			happyIdle2();
		} else if (currentClipName === 'HeadStretch') {
			HeadStretch1();
		} else if (currentClipName === 'StretchAction') {
			HeadStretch1();
		} else if (currentClipName === 'Stretch2') {
			HeadStretch1();
		} else {
			hiAction1();
			hiAction2();
			hiAction3();
			hiAction4();
		}
	}, [currentClipName]);

	const mixerRef = useRef<THREE.AnimationMixer | null>(null);
	const mixerRef2 = useRef<THREE.AnimationMixer | null>(null);
	// const [currentActionName, setCurrentActionName] = useState<string>('HiAction');
	// const [actionType, setActionType] = useState<'start' | 'light' | 'heavy'>('start');

	// // Function to select a random action name
	// const getRandomActionName = (type: 'light' | 'heavy') => {
	// 	const actionsList = type === 'light' ? actionsGroup.lightActions : actionsGroup.heavyActions;
	// 	if (!Array.isArray(actionsList)) {
	// 		return null;
	// 	}
	// 	const randomIndex = Math.floor(Math.random() * actionsList.length);
	// 	return actionsList[randomIndex].action;
	// };

	// useEffect(() => {
	// 	// Find the action configuration in actionsGroup based on currentActionName
	// 	const actionConfig = [...actionsGroup.lightActions, ...actionsGroup.heavyActions].find(
	// 		(config) => config.action === currentActionName
	// 	);

	// 	if (actionConfig) {
	// 		// Assume actions is a map of [actionName: AnimationAction]
	// 		const action = actions[currentActionName];
	// 		if (action) {
	// 			const { repetitions } = actionConfig;
	// 			const clipDuration = action.getClip().duration;
	// 			const totalDuration = clipDuration * repetitions + 1; // Adding fadeIn duration
	// 			action.reset().fadeIn(1).play().setLoop(THREE.LoopRepeat, repetitions);
	// 			action.clampWhenFinished = true;

	// 			setTimeout(() => {
	// 				let nextType: 'light' | 'heavy';
	// 				let nextActionName: string;

	// 				if (actionType === 'start') {
	// 					nextType = 'light';
	// 				} else if (actionType === 'light') {
	// 					nextType = 'heavy';
	// 				} else {
	// 					nextType = 'light';
	// 				}

	// 				nextActionName = getRandomActionName(nextType) as string;

	// 				// Set the next action
	// 				setActionType(nextType);
	// 				setCurrentActionName(nextActionName);
	// 			}, totalDuration * 1000); // Convert to milliseconds
	// 		}
	// 	}

	// 	return () => {
	// 		const action = actions[currentActionName];
	// 		if (action) {
	// 			action.fadeOut(1);
	// 		}
	// 	};
	// }, [currentActionName, actionType]);

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
				if (actionClip) setCurrentClipName(actionClip.name);

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

			const transitionToRandomAction = (actionGroup: keyof Actions, onFinishCallback?: () => void) => {
				const actionDetails = actionsGroup[actionGroup];
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

	useEffect(() => {
		return () => {
			if (mouseIdleTimeoutRef.current !== null) {
				clearTimeout(mouseIdleTimeoutRef.current);
			}
		};
	}, []);

	useFrame((state, delta) => {
		normalizedX = pointer.x;
		normalizedY = pointer.y;
		mixerRef.current?.update(delta);
		mixerRef2.current?.update(delta);
		const changeThreshold = 0.08;
		if (
			Math.abs(normalizedX - lastMousePosition.current.x) > changeThreshold ||
			Math.abs(normalizedY - lastMousePosition.current.y) > changeThreshold
		) {
			if (isMouseIdle) setIsMouseIdle(false);

			if (mouseIdleTimeoutRef.current !== null) {
				clearTimeout(mouseIdleTimeoutRef.current);
			}

			mouseIdleTimeoutRef.current = setTimeout(() => {
				setIsMouseIdle(true);
			}, idleTimeoutDuration) as unknown as number;

			lastMousePosition.current = { x: normalizedX, y: normalizedY };
		}
		animateEyeballs(avatarMesh, { x: normalizedX, y: normalizedY }, isMouseIdle);
		updateJointPositions(normalizedX, normalizedY);
	});

	function updateJointPositions(normalizedX: number, normalizedY: number) {
		const degreeLimits = [20, 12, 10, 5];

		const spine1Node = nodes.Hips?.children[0]?.children[0] as THREE.Object3D | undefined;
		const spine2Node = spine1Node?.children[0] as THREE.Object3D | undefined;
		const neckNode = spine2Node?.children[0] as THREE.Object3D | undefined;
		const headNode = neckNode?.children[0] as THREE.Object3D | undefined;

		for (let index = 0; index < 4; index++) {
			const node = [headNode, neckNode, spine2Node, spine1Node][index];
			if (node) {
				const degrees = getMouseDegreesNormalized(normalizedX, normalizedY, degreeLimits[index]);
				moveJointToMousePosition(degrees, node, isMouseIdle);
			}
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

useGLTF.preload('/cad/snehanReadyPlayerOne-v1.glb');
