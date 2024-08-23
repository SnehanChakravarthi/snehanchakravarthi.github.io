import { Html, useProgress } from '@react-three/drei';

function Loader() {
	const { active, progress } = useProgress();

	return (
		<Html center>
			{active && (
				<div className="z-50 mx-auto flex h-fit w-fit flex-col items-center justify-center rounded-3xl bg-black/50 p-10 font-redhat text-lg text-cyan-500 backdrop-blur-md dark:bg-black/70 dark:text-pink-600">
					<div className="text-center">
						<p className="mb-2">Loading 3D avatar</p>
						<div className="h-2 w-64 overflow-hidden rounded-full bg-gray-200">
							<div
								className="h-full bg-cyan-500 transition-all duration-300 ease-out dark:bg-pink-600"
								style={{ width: `${progress}%` }}
							></div>
						</div>
						<p className="mt-2">{progress.toFixed(1)}% complete</p>
					</div>
					<p className="mt-4 animate-pulse text-sm">Please wait, this may take a moment...</p>
				</div>
			)}
		</Html>
	);
}

export default Loader;
