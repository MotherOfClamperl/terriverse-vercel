/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		formats: ["image/webp"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "media.discordapp.net",
				port: "",
				pathname: "/stickers/**",
			},
		],
	},
};

module.exports = nextConfig;
