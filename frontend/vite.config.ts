import { defineConfig } from "vite";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
const manifest: Partial<VitePWAOptions> = {
	registerType: "prompt",
	includeAssets: ["favicon.ico"],
	manifest: {
		short_name: "Beezle",
		name: "Beezle",
		icons: [
			{
				src: "/android-icon-36x36.png",
				sizes: "36x36",
				type: "image/png",
				density: "0.75",
			},
			{
				src: "/android-icon-48x48.png",
				sizes: "48x48",
				type: "image/png",
				density: "1.0",
			},
			{
				src: "/android-icon-72x72.png",
				sizes: "72x72",
				type: "image/png",
				density: "1.5",
			},
			{
				src: "/android-icon-96x96.png",
				sizes: "96x96",
				type: "image/png",
				density: "2.0",
			},
			{
				src: "/android-icon-144x144.png",
				sizes: "144x144",
				type: "image/png",
				density: "3.0",
			},
			{
				src: "/android-icon-192x192.png",
				sizes: "192x192",
				type: "image/png",
				density: "4.0",
			},
		],
		start_url: ".",
		display: "standalone",
		theme_color: "#fcca03",
		background_color: "#000000",
	},
};
export default defineConfig({
	plugins: [react(), VitePWA(manifest)],
});
