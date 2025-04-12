const { exec } = require("node:child_process");

function checkPostgres() {
	exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

	function handleReturn(error, stdout) {
		const isPgReady = stdout.includes("accepting connections");
		if (isPgReady) {
			console.log("!\n🟢 Postgres está pronto e aceitando conexões\n");
			return;
		}
		process.stdout.write(".");
		checkPostgres();
	}
}
process.stdout.write("\n\n🔴 Aguardando Postgres aceitar conexões");

checkPostgres();
