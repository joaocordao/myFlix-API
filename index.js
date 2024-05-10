const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose');

const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/cfDB');

app.use(morgan('common'));
app.use(express.static('public'));

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

// GET data about a Movie by ID
app.get('/movies/id/:idNumber', async(req, res) => {
    await Movies.findOne({_id: req.params.idNumber})
    .then((movies) => {
      res.status(201).json(movies)
    })
    .catch((err)=>{
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

// GET data about a Genre
app.get('/genre/:genreName', async(req, res) => {
    await Genres.findOne({name: req.params.genreName})
    .then((genre) =>{
      res.status(201).json(genre)
    })
    .catch((err) =>{
      console.log(err);
      res.send(500).send('Error: ' + err)
    });
});

// GET data about a Director
app.get('/directors/:directorName', async(req, res) => {
    await Directors.findOne({name: req.params.directorName})
    .then((directors) =>{
      res.status(201).json(directors)
    })
    .catch((err) =>{
      console.log(err);
      res.send(500).send('Error: ' + err)
    });
  });

// CREATE Add a New User
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

// GET List of All Users
app.get('/users', async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// GET a user by username
app.get('/users/:Username', async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });


// UPDATE a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
  
  });

// CREATE Add a movie to a user's list of favorites
app.post('/users/:username/movies/:movieName', async (req, res) => {
    await Users.findOneAndUpdate({ username: req.params.username },
       { $push: { favoriteMovies: req.params.movieName }
    },
    { new: true }) 
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });


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


// DELETE Delete a user by username
app.delete('/users/:Username', async (req, res) => {
    await Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// DELETE Allow users to remove a movie from their list of favorites
app.delete('/users/:username/movies/:movieID', (req, res) => {
    const { username, movieID } = req.params;
    Users.findOneAndUpdate(
      { Username: username },
      { $pull: { FavoriteMovies: movieID } },
      { new: true }
    )
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(404).send('User not found');
      } else {
        res.status(200).send('Movie removed from favorites');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err.message);
    });
  });

// READ
//app.get('/movies', (req, res) => {
//    let movieListHTML = '<h2>Top Ten Movies:</h2>';
//    movies.forEach(movie => {
//        movieListHTML += `<p><strong>Title:</strong> ${movie.Title}<br><strong>Director:</strong> ${movie.Director}<br><strong>Genre:</strong> ${movie.Genre}</p>`;
//    });
//    res.send(movieListHTML);
//});

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
