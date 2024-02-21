import { Html, useProgress } from '@react-three/drei';
import PuffLoader from 'react-spinners/PuffLoader';

function Loader() {
	const { active, progress } = useProgress();

	return (
		<Html center>
			{/* <PuffLoader
				color="blue"
				loading={active}
				size={75}
				aria-label="Loading Spinner"
				data-testid="loader"
			/> */}

			<div className="font-redhat flex w-full flex-col items-center whitespace-nowrap text-lg text-cyan-800 dark:text-pink-600">
				{active && <p>Avatar loading:</p>}
				{progress.toFixed(1)} %
			</div>
		</Html>
	);
}

export default Loader;
