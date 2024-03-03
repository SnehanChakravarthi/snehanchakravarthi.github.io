'use client';

import React, { useEffect, useRef } from 'react';

function MatrixEffect() {
	// Hardcoded state values
	const initialState = {
		fps: 16,
		color: '#155e75',
		charset: '0123456789ABCDEF',
		size: 14
	};

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext('2d');

		let w: number, h: number, p: number[];
		const resize = () => {
			if (canvas && containerRef.current) {
				// Use the container's dimensions to set the canvas size
				w = canvas.width = containerRef.current.offsetWidth;
				h = canvas.height = containerRef.current.offsetHeight;
				p = Array(Math.ceil(w / initialState.size)).fill(0);
			}
		};

		const random = (items: string) => items[Math.floor(Math.random() * items.length)];

		const draw = () => {
			if (ctx) {
				ctx.fillStyle = 'rgba(15,15,15,0.3)';
				ctx.fillRect(0, 0, w, h);
				ctx.fillStyle = initialState.color;
				ctx.font = `${initialState.size}px sans-serif`;

				for (let i = 0; i < p.length; i++) {
					const v = p[i];
					ctx.fillText(random(initialState.charset), i * initialState.size, v);
					p[i] = v >= h || v >= 10000 * Math.random() ? 0 : v + initialState.size;
				}
			}
		};

		let interval = setInterval(draw, 1000 / initialState.fps);

		window.addEventListener('resize', resize);
		resize();

		return () => {
			clearInterval(interval);
			window.removeEventListener('resize', resize);
		};
	}, []);

	return (
		<div ref={containerRef} className="relative h-full w-full ">
			<canvas ref={canvasRef} />
		</div>
	);
}

export default MatrixEffect;
