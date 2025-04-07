import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
	const allowedMethods = ["GET", "POST"];
	if (!allowedMethods.includes(request.method)) {
		response.status(405).json({
			error: `Method "${request.method}" not allowed`,
		});
	}

	let dbClient;
	try {
		dbClient = await database.getNewClient();

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

			response.status(200).json(pendingMigrations);
		}

		if (request.method === "POST") {
			const migratedMigrations = await migrationRunner({
				...defaultMigrationOptions,
				dryRun: false,
			});

			const statusCode = migratedMigrations.length ? 201 : 200;
			response.status(statusCode).json(migratedMigrations);
		}
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		dbClient.end();
	}
}
