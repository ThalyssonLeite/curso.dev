import database from "infra/database";
import migrationsRunner from "node-pg-migrate";
import path from "node:path";

export default async (request, response) => {
	const dbClient = await database.getNewClient();
	const defaultMigrationsOptions = {
		dbClient,
		dryRun: true,
		dir: path.join("infra", "migrations"),
		direction: "up",
		verbose: true,
		migrationsTable: "pgmigrations",
	};
	if (request.method === "GET") {
		const pendingMigrations = await migrationsRunner(defaultMigrationsOptions);
		await dbClient.end();
		return response.status(200).json(pendingMigrations);
	}

	if (request.method === "POST") {
		const migratedMigrations = await migrationsRunner({
			...defaultMigrationsOptions,
			dryRun: false,
		});
		await dbClient.end();
		const statusCode = migratedMigrations.length ? 201 : 200;
		return response.status(statusCode).json(migratedMigrations);
	}

	await dbClient.end();
	return response.status(405).end();
};
