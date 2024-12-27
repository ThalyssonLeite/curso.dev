import { Client } from "pg";

async function query(queryObject) {
	let client;
	try {
		client = await getNewClient();
		const response = await client.query(queryObject);
		return response;
	} catch (error) {
		console.error(error);
		throw new Error(error);
	} finally {
		client.end();
	}
}

export default {
	query,
	getNewClient,
};

function getSSLValues() {
	const isSSLModeRequired = process.env.POSTGRES_SSL === "require";
	return process.env.POSTGRES_CA
		? { ca: process.env.POSTGRES_CA }
		: isSSLModeRequired;
}

async function getNewClient() {
	const client = new Client({
		host: process.env.POSTGRES_HOST,
		port: process.env.POSTGRES_PORT,
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		ssl: getSSLValues(),
	});
	await client.connect();
	return client;
}
