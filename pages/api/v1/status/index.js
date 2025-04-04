import database from "../../../../infra/database";

async function status(request, response) {
	return response.status(200).send({
		chave: "Alunos do curso.dev são pessoas acima da média",
	});
}

export default status;
