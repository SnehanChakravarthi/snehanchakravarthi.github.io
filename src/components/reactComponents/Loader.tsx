import { Html, useProgress } from '@react-three/drei';

function Loader() {
	const { active, progress } = useProgress();

	return (
		<Html center>
			<div className="flex w-full flex-col items-center whitespace-nowrap font-redhat text-lg text-cyan-800 dark:text-pink-600">
				{active && <p>Avatar loading:</p>}
				{progress.toFixed(1)} %
			</div>
		</Html>
	);
}

export default Loader;
