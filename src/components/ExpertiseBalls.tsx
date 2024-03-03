import React from 'react';
import MatrixEffect from './reactComponents/MatrixEffect';
import SkillBalls from './reactComponents/SkillBalls';

function ExpertiseBalls() {
	return (
		<div className=" mb-32 h-96 w-full max-w-6xl px-4 md:px-16">
			<div className="flex h-96 flex-col  justify-center divide-y divide-lightCardBorder/60 overflow-hidden rounded-2xl border border-lightCardBorder  bg-black shadow-xl  shadow-lightShadow transition-all duration-150 ease-in-out hover:border-cyan-800 hover:shadow-2xl  hover:shadow-lightShadow dark:divide-darkCardBorder/60 dark:border-darkCardBorder dark:bg-darkCard dark:shadow-darkShadow dark:hover:border-pink-950 dark:hover:bg-darkCardHover dark:hover:shadow-darkShadow sm:-rotate-1 md:hover:-rotate-0 md:hover:scale-105">
				<SkillBalls />
			</div>
		</div>
	);
}

export default ExpertiseBalls;
