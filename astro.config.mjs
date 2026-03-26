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
			components: {
				ThemeProvider: './src/components/ThemeProvider.astro',
				Head: './src/components/Head.astro',
				SiteTitle: './src/components/SiteTitle.astro',
			},
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
					items: [
						{ slug: 'protocols', label: 'Genel Bakış', translations: { en: 'Overview' } },
						{
							label: 'MODBUS',
							collapsed: true,
							autogenerate: { directory: 'protocols/modbus' },
						},
						{
							label: 'DNP3',
							collapsed: true,
							autogenerate: { directory: 'protocols/dnp3' },
						},
						{
							label: 'IEC 60870-5-104',
							collapsed: true,
							autogenerate: { directory: 'protocols/iec104' },
						},
						{
							label: 'IEC 61850',
							collapsed: true,
							autogenerate: { directory: 'protocols/iec61850' },
						},
						{
							label: 'OPC UA',
							collapsed: true,
							autogenerate: { directory: 'protocols/opc-ua' },
						},
						{ slug: 'protocols/opc-da' },
						{ slug: 'protocols/opc-xml' },
						{ slug: 'protocols/s7' },
						{ slug: 'protocols/mqtt' },
						{ slug: 'protocols/ethernet-ip' },
						{ slug: 'protocols/fatek' },
						{ slug: 'protocols/rest-client' },
						{ slug: 'protocols/bacnet' },
						{ slug: 'protocols/knx' },
					],
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
