const {
	iconsPlugin,
	getIconCollections,
	dynamicIconsPlugin
} = require('@egoist/tailwindcss-icons');

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ['class', '[data-theme="dark"]'],
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	safelist: [
		{
			pattern: /i-skill-icons-.*/
		}
	],
	theme: {
		screens: {
			xs: '540px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px'
		},
		fontFamily: {
			microgammaBold: ['MicrogrammaBoldExtendedD', 'sans-serif'],
			microgammaMedium: ['MicrogrammaMediumExtendedD', 'sans-serif'],
			virgil: ['Virgil', 'sans-serif'],
			redhat: ['red-hat-mono', 'monospace']
		},
		extend: {
			colors: {
				darkBG: '#101214',
				lightBG: '#f2f0ed',
				darkGrid: '#282E33',
				lightGrid: '#91b4bf',
				darkText: '#C7D1DB',
				lightText: '#155e75',
				darkCard: '#0d0207',
				lightCard: '#f5f1eb',
				darkCardBorder: '#361b27',
				lightCardBorder: '#7ba5b3',
				darkShadow: '#000000',
				lightShadow: '#05202b',
				lightCardHover: '#d5e5eb',
				darkCardHover: '#1c0510',
				baseLight: '#7ba9b5',
				baseDark: '#381627'
			},
			dropShadow: {
				'2xl': '1px 4px 1px rgba(22, 78, 99, 1)'
			}
		}
	},
	plugins: [
		iconsPlugin({
			collections: getIconCollections(['skill-icons', 'logos'])
		}),
		dynamicIconsPlugin()
	]
};
