// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://inscada.com',
	base: '/docs',
	integrations: [
		starlight({
			title: 'inSCADA Docs',
			logo: {
				src: './src/assets/logo.png',
				replacesTitle: false,
			},
			defaultLocale: 'tr',
			locales: {
				tr: { label: 'Türkçe', lang: 'tr' },
				en: { label: 'English', lang: 'en' },
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/inscada-app' },
			],
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: 'Başlangıç',
					translations: { en: 'Getting Started' },
					autogenerate: { directory: 'getting-started' },
				},
				{
					label: 'Platform',
					translations: { en: 'Platform' },
					autogenerate: { directory: 'platform' },
				},
				{
					label: 'Görselleştirme',
					translations: { en: 'Visualization' },
					autogenerate: { directory: 'visualization' },
				},
				{
					label: 'Protokoller',
					translations: { en: 'Protocols' },
					autogenerate: { directory: 'protocols' },
				},
				{
					label: 'REST API',
					translations: { en: 'REST API' },
					autogenerate: { directory: 'api' },
				},
				{
					label: 'AI Araçları',
					translations: { en: 'AI Tools' },
					autogenerate: { directory: 'ai' },
				},
				{
					label: 'Kurulum & Yönetim',
					translations: { en: 'Deployment & Admin' },
					autogenerate: { directory: 'deployment' },
				},
				{
					label: 'Ürünler',
					translations: { en: 'Products' },
					autogenerate: { directory: 'products' },
				},
			],
		}),
	],
});
