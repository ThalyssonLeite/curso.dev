import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
	const dbClient = await database.getNewClient();

	const defaultMigrationOptions = {
		dbClient,
		dir: join("infra", "migrations"),
		direction: "up",
		migrationsTable: "pgmigrations",
		verbose: true,
	};

	if (request.method === "GET") {
		const pendingMigrations = await migrationRunner({
			...defaultMigrationOptions,
			dryRun: true,
		});

		dbClient.end();

		response.status(200).json(pendingMigrations);
	}

	if (request.method === "POST") {
		const migratedMigrations = await migrationRunner({
			...defaultMigrationOptions,
			dryRun: false,
		});

		dbClient.end();

		const statusCode = migratedMigrations.length ? 201 : 200;
		response.status(statusCode).json(migratedMigrations);
	}

	response.status(405).end();
}
