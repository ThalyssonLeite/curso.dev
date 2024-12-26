test("GET to api/v1/status should return 200", async () => {
	const response = await fetch("http://localhost:3000/api/v1/status");
	expect(response.status).toBe(200);

	const { updated_at, services } = await response.json();

	const parsedUpdatedAt = new Date(updated_at).toISOString();
	expect(parsedUpdatedAt).toEqual(updated_at);

	expect(services.database.version).toEqual("16.0");
	expect(services.database.max_connections).toEqual(100);
	expect(services.database.opened_connections).toEqual(1);
});
