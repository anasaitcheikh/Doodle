
/**
 * @constant {objet} mongoose - Correspond à l'appel du module mongoose.
*/
const mongoose = require('mongoose');

/**
 * @constant {string} hostname - Correspond à l'url de la bade de données mongo.
*/
const hostname = 'mongodb://localhost/middleware'; 


// On se connecte à la base de données
// N'oubliez pas de lancer ~/mongodb/bin/mongod dans un terminal !
mongoose.connect(hostname, { useNewUrlParser: true }, function(err) {
  if (err) { 
  	console.log(err)
  	throw err
  }else{
  	console.log("Connection to mongodb ok")
  }
})


// Création du schéma pour les commentaires
var RenionSchema = new mongoose.Schema({
  // pseudo : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
  // contenu : String,
  // date : { type : Date, default : Date.now }
  title : { type : String },
  place : { type : String },
  note : { type : String },
  //date : {},
  addComment : { type : Boolean },
  maxParticipant : { type: Number, min: 1 },
  //comment : {},
  //admin : Schema.Types.ObjectId,
  //participant : Schema.Types.ObjectId,
});
 

// Création du Model pour les commentaires
var RenionModel = mongoose.model('Renion', RenionSchema);
 

// On crée une instance du Model
// var renion = new RenionModel({ pseudo : 'Atinux' });
// renion.contenu = 'Salut, super article sur Mongoose !';
var renion = new RenionModel({ title : 'renion test' });
renion.date = renion;
 

// On le sauvegarde dans MongoDB !
renion.save(function (err) {
  if (err) { throw err; }
  console.log('Commentaire ajouté avec succès !');
  // On se déconnecte de MongoDB maintenant
  mongoose.connection.close();
});