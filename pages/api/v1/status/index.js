import database from "infra/database";

async function getVersion() {
	const response = await database.query("SHOW server_version");
	const result = response.rows[0];
	const version = result.server_version;
	return version;
}

async function getMaxConnections() {
	const response = await database.query("SHOW max_connections");
	const result = response.rows;
	const maxConnections = result[0].max_connections;
	return Number(maxConnections);
}

async function getOpenedConnections() {
	const databaseName = process.env.POSTGRES_DB;
	const response = await database.query(
		`SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = '${databaseName}'`,
	);
	const result = response.rows;
	const openedConnections = result[0].count;
	return Number(openedConnections);
}

export default async (request, response) => {
	const updatedAt = new Date().toISOString();
	response.status(200).json({
		updated_at: updatedAt,
		services: {
			database: {
				version: await getVersion(),
				max_connections: await getMaxConnections(),
				opened_connections: await getOpenedConnections(),
			},
		},
	});
};
