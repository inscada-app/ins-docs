// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi';

function versionSidebar(v) {
	return [
		{
			label: 'Başlangıç',
			translations: { en: 'Getting Started' },
			autogenerate: { directory: `${v}/getting-started` },
		},
		{
			label: 'Platform',
			translations: { en: 'Platform' },
			items: [
				{ slug: `${v}/platform/architecture` },
				{ slug: `${v}/platform/projects` },
				{ slug: `${v}/platform/connections` },
				{ slug: `${v}/platform/devices` },
				{ slug: `${v}/platform/variables` },
				{ slug: `${v}/platform/alarms` },
				{ slug: `${v}/platform/users-roles` },
				{ slug: `${v}/platform/expressions` },
				{ slug: `${v}/platform/data-transfers` },
				{ slug: `${v}/platform/logs` },
				{ slug: `${v}/platform/settings` },
				{
					label: 'Script Engine',
					collapsed: false,
					autogenerate: { directory: `${v}/platform/scripts` },
				},
				{
					label: 'SVG Animations',
					collapsed: true,
					autogenerate: { directory: `${v}/platform/animations` },
				},
				{ slug: `${v}/platform/faceplates` },
				{ slug: `${v}/platform/custom-menus` },
				{ slug: `${v}/platform/web-components` },
				{ slug: `${v}/platform/dashboards` },
			],
		},
		{
			label: 'Protokoller',
			translations: { en: 'Protocols' },
			items: [
				{ slug: `${v}/protocols`, label: 'Genel Bakış', translations: { en: 'Overview' } },
				{ label: 'MODBUS', collapsed: true, autogenerate: { directory: `${v}/protocols/modbus` } },
				{ label: 'DNP3', collapsed: true, autogenerate: { directory: `${v}/protocols/dnp3` } },
				{ label: 'IEC 60870-5-104', collapsed: true, autogenerate: { directory: `${v}/protocols/iec104` } },
				{ label: 'IEC 61850', collapsed: true, autogenerate: { directory: `${v}/protocols/iec61850` } },
				{ label: 'OPC UA', collapsed: true, autogenerate: { directory: `${v}/protocols/opc-ua` } },
				{ slug: `${v}/protocols/opc-da` },
				{ slug: `${v}/protocols/opc-xml` },
				{ slug: `${v}/protocols/s7` },
				{ slug: `${v}/protocols/mqtt` },
				{ slug: `${v}/protocols/ethernet-ip` },
				{ slug: `${v}/protocols/fatek` },
				{ slug: `${v}/protocols/rest-client` },
				{ slug: `${v}/protocols/bacnet` },
				{ slug: `${v}/protocols/knx` },
			],
		},
		{
			label: 'REST API',
			translations: { en: 'REST API' },
			autogenerate: { directory: `${v}/api` },
		},
		...(v === 'jdk21'
			? [{
				label: 'REST API Reference',
				translations: { en: 'REST API Reference' },
				collapsed: true,
				items: openAPISidebarGroups,
			}]
			: []),
		{
			label: 'AI Araçları',
			translations: { en: 'AI Tools' },
			autogenerate: { directory: `${v}/ai` },
		},
		{
			label: 'Kurulum & Yönetim',
			translations: { en: 'Deployment & Admin' },
			autogenerate: { directory: `${v}/deployment` },
		},
		{
			label: 'Ürünler',
			translations: { en: 'Products' },
			autogenerate: { directory: `${v}/products` },
		},
	];
}

export default defineConfig({
	site: 'https://inscada.com',
	base: '/docs',
	redirects: {
		'/': '/docs/tr/',
	},
	integrations: [
		starlight({
			plugins: [
				starlightOpenAPI([
					{
						base: 'jdk21/api/reference',
						schema: './src/content/openapi/inscada-jdk21.json',
						label: 'inSCADA REST API',
						collapsed: true,
					},
				]),
			],
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
				Sidebar: './src/components/Sidebar.astro',
				Search: './src/components/Search.astro',
				MarkdownContent: './src/components/MarkdownContent.astro',
			},
			sidebar: [
				...versionSidebar('jdk11'),
				...versionSidebar('jdk21'),
			],
		}),
	],
});
