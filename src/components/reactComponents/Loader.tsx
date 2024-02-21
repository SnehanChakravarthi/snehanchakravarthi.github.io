import { Html, useProgress } from '@react-three/drei';
import PuffLoader from 'react-spinners/PuffLoader';

function Loader() {
	const { active, progress, errors, item, loaded, total } = useProgress();

	return (
		<Html center>
			<PuffLoader
				color="blue"
				loading={active}
				size={75}
				aria-label="Loading Spinner"
				data-testid="loader"
			/>
			<div className="flex w-full flex-row items-center whitespace-nowrap text-lg">
				{progress.toFixed(1)} % loaded
			</div>
		</Html>
	);
}

export default Loader;
