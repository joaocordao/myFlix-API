const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/cfDB');

const express = require('express'),
    fs = require('fs'),
    morgan = require('morgan'),
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');
    
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
        Description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more',
        Genre: {
            Name: 'Drama',
            Description: 'Drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in ton'
        },
        Director: {
            Name: 'David Fincher',
            Bio: 'David Fincher was born in 1962 in Denver, Colorado, and was raised in Marin County, California',
            Birth: '1962',
            Death: '#'
        },
        Featured: 'True'
    },
    {
        Title: 'Natural Born Killers',
        Description: 'Two victims of traumatized childhoods become lovers and psychopathic serial murderers irresponsibly glorified by the mass media',
        Genre: {
            Name: 'Action',
            Description: 'Action film is a film genre that predominantly features chase sequences, fights, shootouts, explosions, and stunt work'
        },
        Director: {
            Name: 'Oliver Stone',
            Bio: 'William Oliver Stone was born in New York City, to Jacqueline (Goddet) and Louis Stone, a stockbroker. After dropping out of Yale University, he became a soldier in the Vietnam War',
            Birth: '1946',
            Death: '#'
        },
        Featured: 'True'
    },
    {
        Title: 'Lion',
        Description: 'A five-year-old Indian boy is adopted by an Australian couple after getting lost hundreds of kilometers from home. 25 years later, he sets out to find his lost family.',
        Genre: {
            Name: 'Drama',
            Description: 'Drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in ton'
        },
        Director: {
            Name: 'Garth Davis',
            Bio: 'Garth Davis work has been recognized in every major award show around the world. His rigorous commitment to detail, cinematic sensibilities and deep appreciation of the actor-director relationship are his trademark.',
            Birth: '1973',
            Death: '#'
        },
        Featured: 'True'
    },
    {
        Title: 'Oppenheimer',
        Description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
        Genre: {
            Name: 'Thriller',
            Description: 'Thriller film, also known as suspense film or suspense thriller, is a broad film genre that evokes excitement and suspense in the audience.'
        },
        Director: {
            Name: 'Christopher Nolan',
            Bio: 'Best known for his cerebral, often nonlinear, storytelling, acclaimed Academy Award winner writer/director/producer Sir Christopher Nolan CBE was born in London, England.',
            Birth: '1970',
            Death: '#'
        },
        Featured: 'True'
    },
    {
        Title: 'Forest Gump',
        Description: 'The history of the United States from the 1950\'s to the 70\'s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.',
        Genre: {
            Name: 'Drama',
            Description: 'Drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in ton'
        },
        Director: {
            Name: 'Robert Zemeckis',
            Bio: 'A whiz-kid with special effects, Robert is from the Spielberg camp of film-making. Usually working with writing partner Bob Gale, Robert\'s earlier films show he has a talent for zany comedy and special effect vehicles.',
            Birth: '1952',
            Death: '#'
        },
        Featured: 'True'
    },
    {
        Title: 'Pulp Fiction',
        Description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        Genre: {
            Name: 'Crime',
            Description: 'Crime films, in the broadest sense, is a film genre inspired by and analogous to the crime fiction literary genre. Films of this genre generally involve various aspects of crime and its detection.'
        },
        Director: {
            Name: 'Quentin Tarantino',
            Bio: 'Quentin Jerome Tarantino was born in Knoxville, Tennessee. His father, Tony Tarantino, is an Italian-American actor and musician from New York, and his mother, Connie (McHugh), is a nurse from Tennessee. Quentin moved with his mother to Torrance, California, when he was four years old.',
            Birth: '1963',
            Death: '#'
        },
        Featured: 'True'
    },
    {
        Title: 'Back to the Future',
        Description: 'Marty McFly, a 17-year-old high school student, is accidentally sent 30 years into the past in a time-traveling DeLorean invented by his close friend, the maverick scientist Doc Brown.',
        Genre: {
            Name: 'Adventure',
            Description: 'An adventure film is a form of adventure fiction, and is a genre of film. Subgenres of adventure films include swashbuckler films, pirate films, and survival films.'
        },
        Director: {
            Name: 'Robert Zemeckis',
            Bio: 'A whiz-kid with special effects, Robert is from the Spielberg camp of film-making. Usually working with writing partner Bob Gale, Robert\'s earlier films show he has a talent for zany comedy and special effect vehicles.',
            Birth: '1952',
            Death: '#'
        },
        Featured: 'True'
    },
    {
        Title: 'Jaws',
        Description: 'When a killer shark unleashes chaos on a beach community off Cape Cod, it\'s up to a local sheriff, a marine biologist, and an old seafarer to hunt the beast down.',
        Genre: {
            Name: 'Thriller',
            Description: 'Thriller film, also known as suspense film or suspense thriller, is a broad film genre that evokes excitement and suspense in the audience.'
        },
        Director: {
            Name: 'Steven Spielberg',
            Bio: 'One of the most influential personalities in the history of cinema, Steven Spielberg is Hollywood\'s best known director and one of the wealthiest filmmakers in the world.',
            Birth: '1946',
            Death: '#'
        },
        Featured: 'True'
    },
    {
        Title: 'Psycho',
        Description: 'A Phoenix secretary embezzles $40,000 from her employer\'s client, goes on the run and checks into a remote motel run by a young man under the domination of his mother.',
        Genre: {
            Name: 'Horror',
            Description: 'Horror is a film genre that seeks to elicit fear or disgust in its audience for entertainment purposes.'
        },
        Director: {
            Name: 'Alfred Hitchcock',
            Bio: 'Alfred Joseph Hitchcock, the Master of Suspense, was born in Leytonstone, Essex, England. He was the son of Emma Jane (Whelan; 1863 - 1942) and East End greengrocer William Hitchcock (1862 - 1914). His parents were both of half English and half Irish ancestry.',
            Birth: '1899',
            Death: '1980'
        },
        Featured: 'True'
    },
    {
        Title: 'Star Wars: Episode IV',
        Description: 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire\'s world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.',
        Genre: {
            Name: 'Sci-fi',
            Description: 'Science fiction (or sci-fi or SF) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, mutants, interstellar travel, time travel, or other technologies.'
        },
        Director: {
            Name: 'George Lucas',
            Bio: 'George Walton Lucas, Jr. was raised on a walnut ranch in Modesto, California. His father was a stationery store owner and he had three siblings.',
            Birth: '1944',
            Death: '#'
        },
        Featured: 'True'
    }
]



// GET a list of All Movies
app.get('/movies', async (req, res) => {
    await Movies.find()
    .then((movies)=>{
      res.status(201).json(movies);
    })  
    .catch((err) =>{
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});