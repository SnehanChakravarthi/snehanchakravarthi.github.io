import React from 'react';
import zeroDV from '/video/zerodvAR.mp4';
import snehan from '/video/snehan.mp4';

function Iphone({
	className = 'max-w-52',
	videoChoice
}: {
	className?: string;
	videoChoice?: string;
}) {
	const selectedVideo = videoChoice === 'zerophone' ? zeroDV : snehan;
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
				loading="eager"
			/>
		</div>
	);
}

export default Iphone;
