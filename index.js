const express = require('express'),
    fs = require('fs'),
    morgan = require('morgan'),
    path = require('path'),
    app = express(),
    bodyParser = require('body-parser'),
    uuid = require('uuid');
    
app.use(bodyParser.json());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

let users = [
    {
        id: 1,
        name: "Joao",
        favoriteMovies: []
    },
    {
        id: 1,
        name: "Joao",
        favoriteMovies: []
    }
]

let movies = [
    {
        Title: 'Fight Club',
        Director: 'David Fincher',
        Genre: 'Thriller'
    },
    {
        Title: 'Natural Born Killers',
        Director: 'Oliver Stone',
        Genre: 'Action'
    },
    {
        Title: 'Lion',
        Director: 'Garth Davis',
        Genre: 'Drama'
    },
    {
        Title: 'Oppenheimer',
        Director: 'Christopher Nolan',
        Genre: 'Thriller'
    },
    {
        Title: 'Forest Gump',
        Director: 'Robert Zemeckis',
        Genre: 'Drama'
    },
    {
        Title: 'Pulp Fiction',
        Director: 'Quentin Tarantino',
        Genre: 'Crime'
    },
    {
        Title: 'Back to the Future',
        Director: 'Robert Zemeckis',
        Genre: 'Adventure'
    },
    {
        Title: 'Jaws',
        Director: 'Steven Spielberg',
        Genre: 'Thriller'
    },
    {
        Title: 'Psycho',
        Director: 'Alfred Hitchcock',
        Genre: 'Horror'
    },
    {
        Title: 'Star Wars',
        Director: 'George Lucas',
        Genre: 'Sci-Fi'
    }
]
app.use(morgan('combined', {stream: accessLogStream}));
app.use(express.static('public'));


// CREATE
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }
})


// UPDATE
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updateUser = req.body;
 
    let user = users.find( user => user.id == id);

    if (user) {
        user.name = updateUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user')
    }
})


// CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
 
    let user = users.find( user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }
})


// DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
 
    let user = users.find( user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }
})


// DELETE
app.delete('/users/:id/', (req, res) => {
    const { id } = req.params;
 
    let user = users.find( user => user.id == id);

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`user ${id} has been deleted`);
    } else {
        res.status(400).send('no such user')
    }
})


// READ
app.get('/movies', (req, res) => {
    let movieListHTML = '<h2>Top Ten Movies:</h2>';
    movies.forEach(movie => {
        movieListHTML += `<p><strong>Title:</strong> ${movie.Title}<br><strong>Director:</strong> ${movie.Director}<br><strong>Genre:</strong> ${movie.Genre}</p>`;
    });
    res.send(movieListHTML);
});


// READ
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find ( movie => movie.Title === title );

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no scuch movie');
    }
})


// READ
app.get('/movies/genres/:genreName', (req, res) => {
    const { genreName } = req.params;
    const moviesWithGenre = movies.filter(movie => movie.Genre === genreName);

    if (moviesWithGenre.length > 0) {
        const movieTitles = moviesWithGenre.map(movie => movie.Title);
        res.status(200).json(movieTitles);
    } else {
        res.status(404).send('No movies found with the specified genre');
    }
})


// READ
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const moviesWithDirector = movies.filter(movie => movie.Director === directorName);

    if (moviesWithDirector.length > 0) {
        const movieTitles = moviesWithDirector.map(movie => movie.Title);
        res.status(200).json(movieTitles);
    } else {
        res.status(404).send('No movies found with the specified director');
    }
})


app.get('/', (req, res) => {
    res.send('Welcome to MyFlix, movie lovers of the World!')
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oh oh, this is not working!');
});

app.listen(8080, () => {
    console.log('The MyFlix app is listening on port 8080');
});
