const app = require("express")();
const port = 8080;
const swaggerUi = require("swagger-ui-express");
const yamljs = require("yamljs");
const swaggerDocument = yamljs.load("./docs/swagger.yaml");

const movies = [
	{ id: 1, name: "Indiana Jones", price: 19.59 },
	{ id: 2, name: "Matrix", price: 29.59 },
	{ id: 3, name: "Star Wars", price: 19.59 },
	{ id: 4, name: "Sin City", price: 19.59 },
	{ id: 5, name: "Who killed Rogger Rabbit", price: 19.59 },
	{ id: 6, name: "Kill Bill", price: 19.59 },
	{ id: 7, name: "Pulp Fiction", price: 19.59 },
	{ id: 8, name: "Saving Private Banner", price: 19.59 },
];

app.get("/movies", (req, res) => {
	res.send(movies);
});

app.get("/movies/:id", (req, res) => {
	if (typeof movies[req.params.id - 1] === "undefined") {
		return res.status(404).send({ error: "Movie not found" });
	}

	res.send(movies[req.params.id - 1]);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
	console.log(`API up at: http://localhost:${port}`);
});
