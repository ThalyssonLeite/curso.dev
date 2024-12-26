import { Client } from "pg";

async function query(queryObject) {
	const client = new Client({
		host: process.env.POSTGRES_HOST,
		port: process.env.POSTGRES_PORT,
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		ssl: getSSLValues(),
	});
	await client.connect();
	try {
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
	query: query,
};

function getSSLValues() {
	const isNotLocal = process.env.NODE_ENV !== "development";
	const CACertificate = process.env.POSTGRES_CA;
	return CACertificate ? { ca: CACertificate } : isNotLocal;
}
