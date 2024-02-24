import React from 'react';

function Iphone({
	className = 'max-w-52',
	videoChoice
}: {
	className?: string;
	videoChoice?: string;
}) {
	const selectedVideo = videoChoice === 'zerophone' ? '/video/zerodvAR.mp4' : '/video/snehan.mp4';
	return (
		<div className="relative flex justify-center">
			<video
				className="absolute -z-10 mt-[8.2%] rounded-3xl px-[7.7%]"
				autoPlay
				muted
				loop
				playsInline
			>
				<source src={selectedVideo} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
			<img
				src="/src/assets/images/devices/iPhone.png"
				alt="Iphone device showing an application"
				className={className}
			/>
		</div>
	);
}

export default Iphone;
