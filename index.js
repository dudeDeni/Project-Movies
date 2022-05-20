const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
const swaggerUi = require("swagger-ui-express");
const yamljs = require("yamljs");
const { request } = require("express");
const swaggerDocument = yamljs.load("./docs/swagger.yaml");

app.use(cors());
app.use(express.json());

app.use(express.static('./'));
app.get('/', function(req,res) {
	res.render('index.html');
})

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

const actors = [
	{ id: 1, actorName: "Humphrey Bogart"},
	{ id: 2, actorName: "Cary Grant"},
	{ id: 3, actorName: "James Stewart"},
	{ id: 4, actorName: "Marlon Brando"},
	{ id: 5, actorName: "Katharine Hepburn"},
	{ id: 6, actorName: "Bette Davis"},
	{ id: 7, actorName: "Audrey Hepburn"},
	{ id: 8, actorName: "Ingrid Bergman"},
];

const movieActors = [
	{ movieId:1, actorId: 1},
	{ movieId:1, actorId: 2},
	{ movieId:2, actorId: 3},
	{ movieId:2, actorId: 4},
	{ movieId:3, actorId: 5},
	{ movieId:4, actorId: 2},
	{ movieId:4, actorId: 4},
	{ movieId:5, actorId: 6},
	{ movieId:5, actorId: 7},
	{ movieId:6, actorId: 8},
	{ movieId:7, actorId: 5},
	{ movieId:8, actorId: 3},
]

// filter search all actor id objects with movie
//for or map find all actors



app.get("/movies", (req, res) => {
	moviesWithActors = movies.map((movie) => {
		let copy = {...movie };
		copy.actors = getMovieActors(movie.id);
		return copy;
	})
	res.send(moviesWithActors);
});
app.get("/actors", (req, res) => {
	actorsWithMovies = actors.map((actor) => {
		let copy = {...actor};
		copy.movies = getActorsByMovieId(actor.id);
		return copy;
	})
	res.send(actorsWithMovies);
});


app.get("/movies/:id", (req, res) => {
	if (typeof movies[req.params.id - 1] === "undefined") {
		return res.status(404).send({ error: "Movie not found" });
	}

	res.send(movies[req.params.id - 1]);
});

app.get("/actors/:id", (req, res) => {
	if (typeof actors[req.params.id - 1] === "undefined") {
		return res.status(404).send({ error: "Actor not found" });
	}

	res.send(actors[req.params.id - 1]);
});


app.post("/movies", (req, res) => {
	if (!req.body.name || !req.body.price) {
		return res.status(400).send({ error: "One or all params are missing" });
	}
	let lastId = movies[movies.length-1].id;
	let movie = {
		id: lastId + 1,
		name: req.body.name,
		price: req.body.price,
	};
	movies.push(movie);

	res
		.status(201)
		.location(`${getBaseUrl(req)}/movies/${movies.length}}`)
		.send(movie);
});

app.delete("/movies/:id", (req, res) => {
	let index = movies.findIndex(m => m.id == req.params.id)
	console.log("test");
	if ( index == -1) {
		return res.status(404).send({ error: "Movie not found" });
	}

	movies.splice(index, 1);

	res.status(204).send();
});

app.put("/movies/:id", (req, res) => {
	let movie = movies.find(m => m.id == req.params.id)
	console.log("test");
	if ( !movie ) {
		return res.status(404).send({ error: "Movie not found" });
	}

	Object.keys(req.body).forEach(key => {
		movie[key] = req.body[key];
	});

	res.status(204).send();
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
	console.log(`API up at: http://localhost:${port}`);
});

const getBaseUrl = (req) => {
	return req.connection && req.connection.encrypted
		? "https"
		: "http" + `://${req.headers.host}`;
}



function getMovieActors(movieId) {
	let results = movieActors.filter( i => i.movieId == movieId);
	return results.map((movieActor) => {
		return actors.find( actor => {
			return actor.id == movieActor.actorId;
		})
	})
}

function getActorsByMovieId(actorId) {
	let results = movieActors.filter( i => i.actorId == actorId);
	return results.map((movieActor) => {
		return movies.find( movie => {
			return movie.id == movieActor.movieId;
		})
	})
}