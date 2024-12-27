const dotEnv = require("dotenv");
dotEnv.config({
	path: ".env.development",
});
const nextConfig = require("next/jest");
const createJestConfig = nextConfig();
const jestConfig = createJestConfig({
	moduleDirectories: ["node_modules", "<rootDir>"],
});

module.exports = jestConfig;
