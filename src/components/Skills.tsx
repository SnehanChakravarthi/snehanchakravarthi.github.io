import react, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';
import UniqueHighlight from './reactComponents/Highlighter';
import rough from 'roughjs';
import { line, curveNatural } from 'd3-shape';

const skills = {
	'Front-end': [
		{ skill: 'Javascript', expertise: 3 },
		{ skill: 'Typescript', expertise: 3 },
		{ skill: 'Three.js', expertise: 3 },
		{ skill: 'HTML', expertise: 3 },
		{ skill: 'CSS', expertise: 3 },
		{ skill: 'React', expertise: 3 },
		{ skill: 'MDX', expertise: 3 },
		{ skill: 'Vue', expertise: 2 },
		{ skill: 'Svelte', expertise: 2 },
		{ skill: 'HTMX', expertise: 2 },
		{ skill: 'Solid', expertise: 1 }
	],
	frameworks: [
		{ skill: 'Next.js', expertise: 3 },
		{ skill: 'r3f', expertise: 3 },
		{ skill: 'Astro', expertise: 3 },
		{ skill: 'SvelteKit', expertise: 2 },
		{ skill: 'Nuxt', expertise: 2 },
		{ skill: 'Remix', expertise: 2 }
	],
	tools: [
		{ skill: 'Prisma', expertise: 3 },
		{ skill: 'ReactQuery', expertise: 3 },
		{ skill: 'Redux', expertise: 2 },
		{ skill: 'tRPC', expertise: 2 },
		{ skill: 'FramerMotion', expertise: 2 }
	],
	'back-End': [
		{ skill: 'Nodejs', expertise: 3 },
		{ skill: 'Express', expertise: 3 },
		{ skill: 'Python', expertise: 3 },
		{ skill: 'Flask', expertise: 3 },
		{ skill: 'FastAPI', expertise: 2 },
		{ skill: 'Django', expertise: 1 },
		{ skill: 'Rust', expertise: 1 },
		{ skill: 'Go', expertise: 1 }
	],
	databases: [
		{ skill: 'PostgreSQL', expertise: 3 },
		{ skill: 'Supabase', expertise: 3 },
		{ skill: 'MySQL', expertise: 3 },
		{ skill: 'MongoDB', expertise: 2 },
		{ skill: 'Firebase', expertise: 2 }
	],
	API: [
		{ skill: 'Rest', expertise: 3 },
		{ skill: 'GraphQL', expertise: 2 }
	],
	devOps: [
		{ skill: 'Docker', expertise: 3 },
		{ skill: 'Vercel', expertise: 3 },
		{ skill: 'Kubernetes', expertise: 2 },
		{ skill: 'AWS', expertise: 2 },
		{ skill: 'GCP', expertise: 1 },
		{ skill: 'Azure', expertise: 1 }
	],
	testing: [
		{ skill: 'Jest', expertise: 2 },
		{ skill: 'Mocha', expertise: 2 },
		{ skill: 'Cypress', expertise: 1 },
		{ skill: 'Playwright', expertise: 1 }
	],
	design: [
		{ skill: 'Figma', expertise: 3 },
		{ skill: 'XD', expertise: 3 },
		{ skill: 'Photoshop', expertise: 3 },
		{ skill: 'Indesign', expertise: 3 },
		{ skill: 'Illustrator', expertise: 3 }
	],
	Tools: [
		{ skill: 'Git', expertise: 3 },
		{ skill: 'VSCode', expertise: 3 },
		{ skill: 'Jira', expertise: 3 },
		{ skill: 'Trello', expertise: 3 }
	],
	CAD: [
		{ skill: 'Blender', expertise: 3 },
		{ skill: 'SolidWorks', expertise: 3 }
	]
};

type ExpertiseVisibility = {
	all: boolean;
	Expert: boolean;
	Competent: boolean;
	Beginner: boolean;
};

const Skills = () => {
	const [expertiseVisibility, setExpertiseVisibility] = useState<ExpertiseVisibility>({
		all: false,
		Expert: true,
		Competent: true,
		Beginner: true
	});
	const getCurrentTheme = () => document.documentElement.getAttribute('data-theme') || 'light';
	const startRef = useRef<HTMLDivElement>(null);
	const endRef = useRef<HTMLDivElement>(null);
	const svgRef = useRef<SVGSVGElement>(null);

	const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());

	const toggleExpertise = (expertise: string) => {
		if (expertise === 'all') {
			const newState = !expertiseVisibility.all;
			setExpertiseVisibility({
				all: newState,
				Expert: newState,
				Competent: newState,
				Beginner: newState
			});
		} else {
			setExpertiseVisibility((prev) => ({
				...prev,
				[expertise]: !prev[expertise as keyof ExpertiseVisibility],
				all: false
			}));
		}
	};

	const filterSkillsByExpertise = () => {
		return Object.fromEntries(
			Object.entries(skills).map(([category, skillList]) => [
				category,
				skillList.filter((skill) => {
					if (expertiseVisibility.all) return true;
					if (expertiseVisibility.Expert && skill.expertise === 3) return true;
					if (expertiseVisibility.Competent && skill.expertise === 2) return true;
					if (expertiseVisibility.Beginner && skill.expertise === 1) return true;
					return false;
				})
			])
		);
	};

	const filteredSkills = filterSkillsByExpertise();

	const drawPathWithCircle = () => {
		if (!startRef.current || !endRef.current || !svgRef.current) return;

		const theme = getCurrentTheme();
		const strokeColor = theme === 'dark' ? '#f472b6' : '#155e75';

		const svgRect = svgRef.current.getBoundingClientRect();
		const startRect = startRef.current.getBoundingClientRect();
		const endRect = endRef.current.getBoundingClientRect();

		// Calculate start and end points
		const startPoint = [
			startRect.left - svgRect.left + startRect.width / 2 + 100,
			startRect.top - svgRect.top + startRect.height / 2 + 23
		];
		const endPoint = [
			endRect.left - svgRect.left + endRect.width / 2 - 25,
			endRect.top - svgRect.top + endRef.current.clientHeight / 2 - 10
		];

		// Assuming the circle's center is mi dway between start and end, vertically and horizontally
		const circleCenter = [
			(startPoint[0] + endPoint[0]) / 2,
			(startPoint[1] + endPoint[1]) / 2 + 20
		];

		let intermediatePoints = [];

		const Ipoint1 = [circleCenter[0] + 20, circleCenter[1] - 5];
		const Ipoint2 = [circleCenter[0] - 80, circleCenter[1] - 5];
		const Ipoint3 = [circleCenter[0], circleCenter[1] - 40];

		intermediatePoints.push(Ipoint1, Ipoint2, Ipoint3);

		// Combine all points: start -> circle -> end
		// Adjusting the definition of points with type assertion
		const points: [number, number][] = [startPoint, ...intermediatePoints, endPoint].map(
			(point) => [point[0], point[1]] as [number, number]
		);

		// Assuming `points` is your array of [x, y] tuples including intermediate points
		const lastPoint = points[points.length - 1];
		const secondLastPoint = points[points.length - 2];

		// Calculate the angle
		const angle = Math.atan2(lastPoint[1] - secondLastPoint[1], lastPoint[0] - secondLastPoint[0]);
		// Recalculate the angle if necessary
		const correctedAngle = angle + Math.PI; // Adds 180 degrees in radians, flipping the direction

		// Clear previous SVG content
		svgRef.current.innerHTML = '';

		const rc = rough.svg(svgRef.current);
		// Arrowhead size and shape
		// Arrowhead size and configuration
		const arrowLength = 16;

		// Calculate arrowhead points using the corrected angle
		const arrowPoint1 = [
			lastPoint[0] + Math.cos(correctedAngle - Math.PI / 6) * arrowLength,
			lastPoint[1] + Math.sin(correctedAngle - Math.PI / 6) * arrowLength
		];
		const arrowPoint2 = lastPoint; // Tip of the arrow remains the same
		const arrowPoint3 = [
			lastPoint[0] + Math.cos(correctedAngle + Math.PI / 6) * arrowLength,
			lastPoint[1] + Math.sin(correctedAngle + Math.PI / 6) * arrowLength
		];

		// Path for the arrowhead
		const arrowPathData = `M ${arrowPoint1[0]} ${arrowPoint1[1]} L ${arrowPoint2[0]} ${arrowPoint2[1]} L ${arrowPoint3[0]} ${arrowPoint3[1]} Z`;

		// Draw the arrowhead with Rough.js
		const arrowPath = rc.path(arrowPathData, {
			fill: strokeColor,
			fillStyle: 'solid',
			strokeWidth: 1,
			roughness: 0
		});
		svgRef.current.appendChild(arrowPath);

		// Generate the SVG path data string manually
		const lineGenerator = line().curve(curveNatural); // Setup the line generator with natural curve
		const pathData = lineGenerator(points); // Generate the path data

		if (pathData) {
			const path = rc.path(pathData, { stroke: strokeColor, strokeWidth: 2, roughness: 0 });
			svgRef.current.appendChild(path);
		}
	};

	useEffect(() => {
		const observer = new MutationObserver(() => {
			const newTheme = getCurrentTheme();
			setCurrentTheme(newTheme);
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme']
		});

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		drawPathWithCircle();
	}, [currentTheme]);

	useEffect(() => {
		drawPathWithCircle();
		const handleResize = () => drawPathWithCircle();

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<section id="skills" className="flex w-screen max-w-7xl flex-col px-4 pt-20 md:px-16 ">
			<div className="relative  pt-32 ">
				<svg ref={svgRef} className="absolute left-0 top-0 h-full w-full" />

				<div className="font-virgil text-color-animate z-0 ml-4 -rotate-1 text-3xl text-cyan-800 sm:text-4xl dark:text-pink-600">
					<p className="text-decoration -rotate-2 text-xl sm:rotate-1 sm:text-3xl">
						"Swiss Army{' '}
						<span className="line-through decoration-black decoration-4 dark:decoration-pink-300">
							knife
						</span>{' '}
						developer"
					</p>
					<p className="ml-6 -rotate-1">
						Over the years, <br />I have amassed these{' '}
						<div
							ref={startRef}
							className="dark:text-shadow-3d-dark text-shadow-3d text-color-animate inline-block"
						>
							skills.
						</div>
					</p>
				</div>

				<div className="font-virgil mb-6 mt-32 flex h-12 rotate-1 flex-col items-end justify-end  gap-2  text-base sm:mb-12 sm:h-20 sm:text-2xl">
					<div className="flex flex-col items-center">
						<p className="text-decoration mb-2 text-base sm:text-lg">
							view my skills by <strong>expertise</strong>{' '}
							<span ref={endRef} className="text-lightText text-xs dark:text-pink-400">
								(click below)
							</span>
						</p>
						<div className="flex sm:gap-2">
							<button
								className={cn(
									'px-3 text-slate-500 dark:text-slate-300',
									expertiseVisibility.all
										? 'dark:circle-sketch-highlight-dark circle-sketch-highlight'
										: ''
								)}
								onClick={() => toggleExpertise('all')}
							>
								All
							</button>
							<button
								className={cn(
									'px-3 text-lime-600',
									expertiseVisibility.Expert
										? 'dark:circle-sketch-highlight-dark circle-sketch-highlight'
										: ''
								)}
								onClick={() => toggleExpertise('Expert')}
							>
								Expert
							</button>
							<button
								className={cn(
									'px-3 text-cyan-600',
									expertiseVisibility.Competent
										? 'dark:circle-sketch-highlight-dark circle-sketch-highlight'
										: ''
								)}
								onClick={() => toggleExpertise('Competent')}
							>
								Competent
							</button>
							<button
								className={cn(
									'px-3 text-fuchsia-600',
									expertiseVisibility.Beginner
										? 'dark:circle-sketch-highlight-dark circle-sketch-highlight'
										: ''
								)}
								onClick={() => toggleExpertise('Beginner')}
							>
								Beginner
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="dark:bg-darkCard dark:border-darkCardBorder bg-lightCard border-lightCardBorder dark:divide-darkCardBorder/60 divide-lightCardBorder/60 dark:hover:shadow-darkShadow dark:shadow-darkShadow shadow-lightShadow hover:shadow-lightShadow dark:hover:bg-darkCardHover flex w-full flex-col justify-center divide-y rounded-2xl  border shadow-xl transition-all duration-300 ease-in-out hover:-rotate-0 hover:scale-105 hover:border-cyan-950 hover:shadow-2xl sm:rotate-1 dark:hover:border-pink-950">
				{Object.entries(filteredSkills).map(([category, skills]) => (
					<div
						className="grid justify-start px-4 py-3 text-sm sm:grid-flow-col sm:text-base "
						key={category}
					>
						<div className="font-virgil text-lightText text-color-animate w-32 pb-1 font-bold uppercase sm:pt-2 dark:text-pink-200">
							{category}
						</div>
						<div className="font-redhat flex flex-wrap gap-2 sm:gap-4">
							{skills.length > 0 ? (
								skills.map((skill) => (
									<UniqueHighlight key={skill.skill} expertise={skill.expertise}>
										<div className="flex items-center gap-1 px-1 sm:gap-2 sm:px-3 sm:py-1">
											<div className="flex h-4 w-4 items-center sm:h-5 sm:w-5">
												<img
													src={`/logos/${skill.skill.toLowerCase()}.svg`}
													alt={`${skill.skill} logo`}
													className="h-4 w-4 sm:h-5 sm:w-5"
												/>
											</div>
											{skill.skill}
										</div>
									</UniqueHighlight>
								))
							) : (
								<div>No skills in this category</div>
							)}
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default Skills;
