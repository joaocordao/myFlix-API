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
app.use(bodyParser.urlencoded({ extended: true }));
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

mongoose.connect('mongodb://localhost:27017/cfDB');

app.use(morgan('common'));
app.use(express.static('public'));

// GET a list of All Movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
    .then((movies)=>{
      res.status(201).json(movies);
    })  
    .catch((err) =>{
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// GET data about a Movie by Title
app.get('/movies/:movieTitle', passport.authenticate('jwt', { session: false }), async(req, res) => {
  await Movies.findOne({Title: req.params.movieTitle})
  .then((movie) => {
    res.status(200).json(movie);
  })
  .catch((err)=>{
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// GET data about a Genre
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), async(req, res) => {
  await Movies.findOne({"Genre.Name": req.params.genreName})
  .then((movie) =>{
    res.status(201).json(movie.Genre)
  })
  .catch((err) =>{
    console.log(err);
    res.send(500).send('Genre not found.');
  });
});

// GET data about a Director
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), async(req, res) => {
    await Movies.findOne({'Director.Name': req.params.directorName})
    .then((movie) =>{
      res.status(201).json(movie.Director)
    })
    .catch((err) =>{
      console.log(err);
      res.send(500).send('Director not found.');
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
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
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

app.put('/users/:Username',  passport.authenticate('jwt', { session: false }), async (req, res) => {
  // CONDITION TO CHECK ADDED HERE
    if(req.user.Username !== req.params.Username){
      return res.status(400).send('Permission denied');
    }
  // CONDITION ENDS HERE
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

// Allow users to add a movie to their list of favorites
app.post("/users/:Username/movies/:MovieID", passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $push: { FavoriteMovies: req.params.MovieID },},
    { new: true }
  ) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
  });

// DELETE Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
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

// Allow users to remove a movie from their list of favorites

app.delete("/users/:Username/:MovieID", passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(404).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err.message); // Sending the error message to the client
    });
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
