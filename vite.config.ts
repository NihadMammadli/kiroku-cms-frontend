import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	return {
		plugins: [react()],
		resolve: {
			alias: {
				api: path.resolve(__dirname, "./src/api"),
				components: path.resolve(__dirname, "./src/components"),
				config: path.resolve(__dirname, "./src/config"),
				layouts: path.resolve(__dirname, "./src/layouts"),
				pages: path.resolve(__dirname, "./src/pages"),
				styles: path.resolve(__dirname, "./src/styles"),
				utils: path.resolve(__dirname, "./src/utils"),
			},
		},
		server: {
			port: 8000,
			proxy: {
				"/api": {
					target: env.VITE_API_URL || "http://localhost:8000",
					changeOrigin: true,
					secure: false,
				},
			},
		},
	};
});
