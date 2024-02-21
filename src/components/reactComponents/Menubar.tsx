import React, { useState } from 'react';

import { authorData } from '@/siteConfig';

interface MenuItem {
	name: string;
	link: string;
}

import { Github, Linkedin, X, Instagram } from '@/components/SocialIcons.tsx';

const DropdownMenu = ({ menu }: { menu: MenuItem[] }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="border-lightGrid hover:bg-lightBG dark:border-darkGrid dark:hover:bg-darkBG flex  h-12 w-12 items-center justify-center border border-x-0 bg-white dark:bg-black">
			<button onClick={() => setIsOpen(!isOpen)} className="">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
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
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					className={`${isOpen ? 'block' : 'hidden'}`}
				>
					<path d="M18 6 6 18" />
					<path d="m6 6 12 12" />
				</svg>
			</button>
			<div
				className={`bg-lightBG dark:bg-darkBG absolute left-0 top-12 z-10 h-auto w-screen rounded-b-3xl border border-white/10 shadow-xl shadow-black transition duration-100 ease-out ${
					isOpen ? 'translate-y-0  opacity-100' : 'invisible  opacity-0'
				}`}
			>
				<div className="flex flex-col">
					<ul className="mt-10 w-full text-center">
						{menu.map((item, index) => (
							<li
								key={index}
								className="py-4 text-xl text-cyan-600 hover:bg-neutral-900 dark:text-pink-500"
							>
								<a href={item.link} className="4">
									{item.name}
								</a>
							</li>
						))}
						<li className="py-4 text-xl text-cyan-600 hover:bg-neutral-900 dark:text-pink-500">
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
									stroke-width="1.75"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<rect width="20" height="16" x="2" y="4" rx="2"></rect>
									<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
								</svg>
							</a>
						</li>
						{Object.entries(authorData.links).map(([name, url]) => (
							<li>
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
