import react, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';
import UniqueHighlight from './reactComponents/Highlighter';
import rough from 'roughjs';
import { line, curveNatural } from 'd3-shape';

const skills = {
	'Front-end': [
		{ skill: 'Javascript', expertise: 3, icon: 'i-skill-icons-javascript h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Typescript', expertise: 3, icon: 'i-skill-icons-typescript h-3 w-3 sm:h-6 sm:w-6' },
		{
			skill: 'Three.js',
			expertise: 3,
			icon: 'dark:i-skill-icons-threejs-light i-logos-threejs h-3 w-3 sm:h-6 sm:w-6'
		},
		{ skill: 'HTML', expertise: 3, icon: 'i-skill-icons-html h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'CSS', expertise: 3, icon: 'i-skill-icons-css h-3 w-3 sm:h-6 sm:w-6' },
		{
			skill: 'React',
			expertise: 3,
			icon: 'dark:i-logos-react i-skill-icons-react-dark h-3 w-3 sm:h-6 sm:w-6'
		},
		{ skill: 'TailwindCSS', expertise: 3, icon: 'i-logos-tailwindcss-icon h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Svelte', expertise: 2, icon: 'i-logos-svelte-icon h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Angular', expertise: 1, icon: 'i-skill-icons-angular-light h-3 w-3 sm:h-6 sm:w-6' },
		{
			skill: 'HTMX',
			expertise: 1,
			icon: 'dark:i-skill-icons-htmx-light i-skill-icons-htmx-dark h-3 w-3 sm:h-6 sm:w-6'
		}
	],
	'back-End': [
		{ skill: 'Python', expertise: 3, icon: 'i-logos-python h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Nodejs', expertise: 3, icon: 'i-logos-nodejs-icon h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Bun', expertise: 3, icon: 'i-skill-icons-bun-dark h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Go', expertise: 3, icon: 'i-logos-go h-3 w-3 sm:h-6 sm:w-6' }
	],
	frameworks: [
		{ skill: 'Next.js', expertise: 3, icon: 'i-logos-nextjs-icon h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'r3f', expertise: 3, icon: 'i-skill-icons-r3f h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Astro', expertise: 3, icon: 'i-logos-astro-icon h-3 w-3 sm:h-6 sm:w-6' },
		{
			skill: 'Express',
			expertise: 3,
			icon: 'dark:i-skill-icons-expressjs-light i-skill-icons-expressjs-dark h-3 w-3 sm:h-6 sm:w-6'
		},

		{ skill: 'Flask', expertise: 3, icon: 'i-skill-icons-flask-light h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'FastAPI', expertise: 2, icon: 'i-skill-icons-fastapi h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Django', expertise: 2, icon: 'i-skill-icons-django h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'SvelteKit', expertise: 2, icon: 'i-logos-svelte-kit h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Remix', expertise: 1, icon: 'i-skill-icons-remix-dark h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Hono', expertise: 1, icon: 'i-logos-hono h-3 w-3 sm:h-6 sm:w-6' }
	],
	CAD: [
		{ skill: 'Blender', expertise: 3, icon: 'i-logos-blender h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: '3Ds Max', expertise: 3, icon: 'i-logos-3ds-max h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Keyshot', expertise: 3, icon: 'i-logos-3ds-max h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Rhino', expertise: 3, icon: 'i-logos-3ds-max h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'SolidWorks', expertise: 3, icon: 'i-logos-solidworks h-3 w-3 sm:h-6 sm:w-6' }
	],
	database: [
		{ skill: 'PostgreSQL', expertise: 3, icon: 'i-logos-postgresql h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'MySQL', expertise: 3, icon: 'i-skill-icons-mysql-dark h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'SQLite', expertise: 3, icon: 'i-skill-icons-sqlite h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'VectorStores', expertise: 3, icon: 'i-logos-vector-icon h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Supabase', expertise: 3, icon: 'i-logos-supabase-icon h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'MongoDB', expertise: 2, icon: 'i-logos-mongodb-icon h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Firebase', expertise: 2, icon: 'i-logos-firebase h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Redis', expertise: 2, icon: 'i-logos-redis h-3 w-3 sm:h-6 sm:w-6' }
	],
	tools: [
		{ skill: 'Prisma', expertise: 3, icon: 'i-skill-icons-prisma h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Drizzle', expertise: 3, icon: 'i-skill-icons-drizzle h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'ReactQuery', expertise: 3, icon: 'i-logos-react-query-icon h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Vite', expertise: 3, icon: 'i-skill-icons-vite-light h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Redux', expertise: 2, icon: 'i-skill-icons-redux h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'tRPC', expertise: 2, icon: 'i-logos-trpc h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'FramerMotion', expertise: 2, icon: 'i-logos-framer h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Puppeteer', expertise: 2, icon: 'i-logos-puppeteer h-3 w-3 sm:h-6 sm:w-6' }
	],

	API: [
		{ skill: 'Rest', expertise: 3, icon: 'i-skill-icons-rest h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'GraphQL', expertise: 2, icon: 'i-logos-graphql h-3 w-3 sm:h-6 sm:w-6' }
	],
	devOps: [
		{ skill: 'Docker', expertise: 3, icon: 'i-skill-icons-docker h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Vercel', expertise: 3, icon: 'i-logos-vercel-icon h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Kubernetes', expertise: 1, icon: 'i-skill-icons-kubernetes h-3 w-3 sm:h-6 sm:w-6' },
		{
			skill: 'AWS',
			expertise: 1,
			icon: 'dark:i-skill-icons-aws-light i-skill-icons-aws-dark h-3 w-3 sm:h-6 sm:w-6'
		},
		{ skill: 'GCP', expertise: 1, icon: 'dark:i-logos-google-cloud h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Azure', expertise: 1, icon: 'i-logos-microsoft-azure h-3 w-3 sm:h-6 sm:w-6' }
	],
	testing: [
		{ skill: 'Postman', expertise: 3, icon: 'i-skill-icons-postman h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Jest', expertise: 1, icon: 'i-skill-icons-jest h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Playwright', expertise: 1, icon: 'i-logos-playwright h-3 w-3 sm:h-6 sm:w-6' }
	],
	design: [
		{ skill: 'Figma', expertise: 3, icon: 'i-logos-figma h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'XD', expertise: 3, icon: 'i-skill-icons-xd h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Photoshop', expertise: 3, icon: 'i-skill-icons-photoshop h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Indesign', expertise: 3, icon: 'i-logos-adobe-indesign h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Illustrator', expertise: 2, icon: 'i-skill-icons-illustrator h-3 w-3 sm:h-6 sm:w-6' },
		{
			skill: 'AfterEffects',
			expertise: 2,
			icon: 'i-skill-icons-aftereffects h-3 w-3 sm:h-6 sm:w-6'
		}
	],
	Tools: [
		{ skill: 'Git', expertise: 3, icon: 'i-skill-icons-git h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Jira', expertise: 3, icon: 'i-logos-jira h-3 w-3 sm:h-6 sm:w-6' },
		{ skill: 'Trello', expertise: 3, icon: 'i-logos-trello h-3 w-3 sm:h-6 sm:w-6' }
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
		const circleCenter = [(startPoint[0] + endPoint[0]) / 2, (startPoint[1] + endPoint[1]) / 2 + 20];

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
		<section id="skills" className="flex w-full max-w-6xl flex-col px-4 md:px-16">
			<div className="relative overflow-hidden pt-20">
				<svg ref={svgRef} className="absolute left-0 top-0 h-full w-full" />

				<div className="text-color-animate z-0 ml-0 -rotate-1 font-virgil text-3xl text-cyan-800 dark:text-pink-600 sm:ml-4 sm:text-4xl">
					<p className="text-decoration -rotate-2 text-xl sm:rotate-1 sm:text-3xl">
						"Swiss Army{' '}
						<span className="line-through decoration-black decoration-4 dark:decoration-pink-300">
							knife
						</span>{' '}
						developer"
					</p>
					<p className="ml-6 -rotate-1">
						Over the years, <br />I have amassed these{' '}
						<span
							ref={startRef}
							className="dark:text-shadow-3d-dark text-shadow-3d text-color-animate inline-block"
						>
							skills.
						</span>
					</p>
				</div>

				<div className="mb-6 mt-32 flex h-12 rotate-1 flex-col items-end justify-end gap-2  font-virgil  text-base sm:mb-12 sm:h-20 sm:text-2xl">
					<div className="flex flex-col items-center">
						<p className="text-decoration mb-2 text-base sm:text-lg">
							view my skills by <strong>expertise</strong>{' '}
							<span ref={endRef} className="text-xs text-lightText dark:text-pink-400">
								(click below)
							</span>
						</p>
						<div className="flex sm:gap-2">
							<button
								className={cn(
									'px-3 text-slate-500 dark:text-slate-300',
									expertiseVisibility.all ? 'dark:circle-sketch-highlight-dark circle-sketch-highlight' : ''
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
			<div className="flex w-full flex-col justify-center divide-y divide-lightCardBorder/60 rounded-2xl border border-lightCardBorder bg-lightCard shadow-xl  shadow-lightShadow transition-all duration-150 ease-in-out hover:border-cyan-800 hover:shadow-2xl  hover:shadow-lightShadow dark:divide-darkCardBorder/60 dark:border-darkCardBorder dark:bg-darkCard dark:shadow-darkShadow dark:hover:border-pink-950 dark:hover:bg-darkCardHover dark:hover:shadow-darkShadow md:rotate-1 md:hover:-rotate-0 md:hover:scale-105">
				{Object.entries(filteredSkills).map(([category, skills]) => (
					<div
						className="grid justify-start px-4 py-2 text-sm sm:grid-flow-col sm:text-base "
						key={category}
					>
						<div className="text-color-animate w-32 pb-1 font-virgil font-bold uppercase text-lightText dark:text-pink-200 sm:pt-2">
							{category}
						</div>
						<div className="ml-2 flex flex-wrap gap-2 font-redhat sm:ml-0 sm:flex-wrap sm:gap-4">
							{skills.length > 0 ? (
								skills.map((skill) => {
									const iconClassName = skill.icon;
									const classes = cn(iconClassName, 'h-5 w-5 sm:h-5 sm:w-5');
									return (
										<UniqueHighlight key={skill.skill} expertise={skill.expertise}>
											<div className="flex h-6 items-center gap-2 px-1 text-xs sm:h-8 sm:gap-2 sm:px-3 sm:py-0 sm:text-base">
												<span className={classes} />
												{skill.skill}
											</div>
										</UniqueHighlight>
									);
								})
							) : (
								<div>No skills in this category</div>
							)}
						</div>
					</div>
				))}
			</div>
			<p className="mt-6 w-3/4 rotate-2  self-end text-end font-virgil text-base text-cyan-800 dark:text-pink-600 sm:w-2/3 sm:text-lg">
				... I continually seek out new technologies to study during my leisure time in order to broaden
				my set of skills.
			</p>
		</section>
	);
};

export default Skills;
