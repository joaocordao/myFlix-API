const express = require('express'),
    fs = require('fs'),
    morgan = require('morgan'),
    path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

let topTenMovies = [
    {
        title: 'Fight Club',
        Director: 'David Fincher'
    },
    {
        title: 'Natural Born Killers',
        Director: 'Oliver Stone'
    },
    {
        title: 'Lion',
        Director: 'Garth Davis'
    },
    {
        title: 'Oppenheimer',
        Director: 'Christopher Nolan'
    },
    {
        title: 'Forest Gump',
        Director: 'Robert Zemeckis'
    },
    {
        title: 'Pulp Fiction',
        Director: 'Quentin Tarantino'
    },
    {
        title: 'Back to the Future',
        Director: 'Robert Zemeckis'
    },
    {
        title: 'Jaws',
        Director: 'Steven Spielberg'
    },
    {
        title: 'Psycho',
        Director: 'Alfred Hitchcock'
    },
    {
        title: 'Star Wars',
        Director: 'George Lucas'
    }
]
app.use(morgan('combined', {stream: accessLogStream}));
app.use(express.static('public'));

app.get('/movies', (req, res) => {
    res.json(topTenMovies);
});

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
