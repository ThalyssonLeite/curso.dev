import database from "infra/database";

beforeAll(cleanDatabase);

async function cleanDatabase() {
	await database.query("DROP SCHEMA public CASCADE;");
	await database.query("CREATE SCHEMA public;");
}

test("GET to api/v1/migrations should return 200", async () => {
	const firstResponse = await fetch("http://localhost:3000/api/v1/migrations", {
		method: "POST",
	});
	expect(firstResponse.status).toBe(201);
	const firstResponseBody = await firstResponse.json();
	expect(Array.isArray(firstResponseBody)).toBe(true);
	expect(firstResponseBody.length).toBeGreaterThan(0);
	const secondResponse = await fetch(
		"http://localhost:3000/api/v1/migrations",
		{
			method: "POST",
		},
	);
	expect(secondResponse.status).toBe(200);
	const secondResponseBody = await secondResponse.json();
	expect(Array.isArray(secondResponseBody)).toBe(true);
	expect(secondResponseBody.length).toEqual(0);
});
