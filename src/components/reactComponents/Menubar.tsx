import React, { useState } from 'react';

import { authorData } from '@/siteConfig';

import { Github, Linkedin, X, Instagram } from '@/components/SocialIcons.tsx';

type MenuItem = {
	name: string;
	link: string;
};

const DropdownMenu: React.FC<{ menu: MenuItem[] }> = ({ menu }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="z-20 flex h-12 w-12 items-center justify-center border border-b-0 border-l-0 border-r-0 border-t-0 border-lightGrid hover:bg-lightBG dark:border-darkGrid dark:hover:bg-darkBG">
			<button onClick={() => setIsOpen(!isOpen)} className="">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className={`${isOpen ? 'hidden' : 'block'}`}
				>
					<line x1="4" x2="20" y1="12" y2="12" />
					<line x1="4" x2="20" y1="6" y2="6" />
					<line x1="4" x2="20" y1="18" y2="18" />
				</svg>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className={`${isOpen ? 'block' : 'hidden'}`}
				>
					<path d="M18 6 6 18" />
					<path d="m6 6 12 12" />
				</svg>
			</button>
			<div
				className={`absolute left-0 top-12 z-10 h-auto w-screen rounded-b-3xl border border-t-0 border-lightGrid bg-white/30 shadow-xl shadow-black backdrop-blur-xl transition duration-100 ease-out dark:border-darkGrid dark:bg-black/30 ${
					isOpen ? 'translate-y-0  ' : 'invisible '
				}`}
			>
				<div className="flex flex-col">
					<ul className="mt-10 w-full text-center">
						{menu.map((item, index) => (
							<li
								key={index}
								className="w-full cursor-pointer py-4 text-xl text-cyan-600 dark:text-pink-500"
							>
								<a href={item.link} className="4">
									{item.name}
								</a>
							</li>
						))}
						<li className="py-4 text-xl text-cyan-600  dark:text-pink-500">
							<a href="/CV.pdf" download className="block">
								CV
							</a>
						</li>
					</ul>
					<ul className="mx-auto my-6 flex w-full flex-row justify-around px-4">
						<li>
							<a
								className="flex h-10 w-10 cursor-pointer flex-col  items-center justify-center"
								href={`mailto:${authorData.email}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.75"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<rect width="20" height="16" x="2" y="4" rx="2"></rect>
									<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
								</svg>
							</a>
						</li>
						{Object.entries(authorData.links).map(([name, url], index) => (
							<li key={index}>
								<a
									href={url}
									target="_blank"
									rel="noopener noreferrer"
									className="flex h-10 w-10 cursor-pointer flex-col  items-center justify-center"
								>
									{name === 'github' && <Github />}
									{name === 'linkedin' && <Linkedin />}
									{name === 'x' && <X />}
									{name === 'instagram' && <Instagram />}
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default DropdownMenu;
