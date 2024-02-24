import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: vercel({
		webAnalytics: { enabled: true }
	}),
	prefetch: true,
	integrations: [
		react(),
		tailwind({
			applyBaseStyles: false
		}),
		icon()
	]
});
