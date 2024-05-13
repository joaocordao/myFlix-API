const mongoose = require('mongoose');

// Define movie schema
let movieSchema = mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Genre: {
      Name: String,
      Description: String,
    },
    Director: {
      Name: String,
      Bio: String,
      Birth: String,
      Death: String,
    },
    ImagePath: String,
    Featured: Boolean,
});
  
// Define user schema
let userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

// Define genre schema
let genreSchema = mongoose.Schema({
    Name: { type: String, required: true },
    Description: String,
});

// Define director schema
let directorSchema = mongoose.Schema({
    Name: { type: String, required: true },
    Bio: String,
    Birth: String,
    Death: String,
});

// Create models from schemas
let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);
let Genre = mongoose.model("Genre", genreSchema); // Define Genre model
let Director = mongoose.model("Director", directorSchema); // Define Director model

// Export models
module.exports = {
    Movie: Movie,
    User: User,
    Genre: Genre,
    Director: Director,
};
