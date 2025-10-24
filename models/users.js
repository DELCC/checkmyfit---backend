const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  // TO DO: remplir users selon la modelisation de la DB : Miro (récupérer l'email si on veut faire la feature mdp oublié ?)
});

const User = mongoose.model("users", userSchema);

module.exports = User;
