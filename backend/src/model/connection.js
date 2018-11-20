/**
 * @constant {objet} mongoose - Correspond à l'appel du module mongoose.
*/
const mongoose = require('mongoose');

/**
 * @constant {string} hostname - Correspond à l'url de la bade de données mongo.
*/
const hostname = 'mongodb://localhost/middleware'; 

/**
 * @constant {objet} MongoObjectID  - Correspond au type ObjectID de mongo.
*/
var MongoObjectID = require("mongodb").ObjectID; 



// On se connecte à la base de données
// N'oubliez pas de lancer ~/mongodb/bin/mongod dans un terminal !
mongoose.connect(hostname, { useNewUrlParser: true }, function(err) {
  if (err) { 
  	console.log(err)
  	throw err
  }else{
  	console.log("Connection to mongodb ok")
    // db.collection("renions").find().toArray(function (error, results) {
    //     if (error) throw error;

    //     results.forEach(function(obj, i) {
    //         console.log(
    //             "ID : "  + obj._id.toString() + "\n" +
    //             "Titre : " + obj.title + "\n"          
    //         );
    //     });
    // });
    
    // db.collection("renions").findOne({ _id: new MongoObjectID("5bc0d325980bc006a0ab91b0") }, function (error, results) {
    //     if (error) throw error;
    //         console.log(results)
    // });

  }
})


const DateRenion = new mongoose.Schema({
                    _id : { type : mongoose.Schema.Types.ObjectId },
                    date : { type: Date, default: Date.now },
                    hourStart : { type : String },
                    hourEnd : { type : String }
                 })  

const Comment = new mongoose.Schema({
                  _id : { type : mongoose.Schema.Types.ObjectId },
                  name :  { type : String },
                  email : { type : String },
                  text : { type : String },
                  create_at : { type: Date, default: Date.now },
                  update_at : { type: Date, default: Date.now }
                })


const Participant = new mongoose.Schema({
                      _id : { type : mongoose.Schema.Types.ObjectId },
                      name :  { type : String },
                      email : { type : String },
                      create_at : { type: Date, default: Date.now },
                      update_at : { type: Date, default: Date.now }
                    })


// Création du schéma pour les renions
const RenionSchema = new mongoose.Schema({
  title : { type : String },
  place : { type : String },
  note : { type : String },
  date : [DateRenion],
  addComment : { type : Boolean },
  maxParticipant : { type: Number, min: 1 },
  comment : [Comment],
  admin : Participant,
  participant : [Participant],
  create_at : { type: Date, default: Date.now },
  update_at : { type: Date, default: Date.now }
});
 

// Création du Model pour les commentaires
var RenionModel = mongoose.model('renion', RenionSchema);
 

// On crée une instance du Model
// var renion = new RenionModel({ pseudo : 'Atinux' });
// renion.contenu = 'Salut, super article sur Mongoose !';
var renion = new RenionModel();
renion.title = 'renion test 2.0'
renion.place = 'Skype'
renion.note = 'rdv pour la révision'
renion.addComment = true
renion.maxParticipant = 5
renion.date.push({  
                    date: new Date().now,
                    hourStart : "begin",
                    hourEnd : 'end'
                  })
renion.comment.push({
                      name : 'moub name',
                      email : 'moub email',
                      text : 'moub text',
                      create_at : new Date().now,
                      update_at : new Date().now
                    }) 
renion.admin = { 
                 name :'moub name admin',
                 email : 'moub email admin',
                 create_at : new Date().now,
                 update_at : new Date().now
                }
renion.participant.push({
                          name : 'moub participant',
                          email : 'moub email',
                          create_at : new Date().now,
                          update_at : new Date().now
                        })

// On le sauvegarde dans MongoDB !
// renion.save(function (err) {
//   if (err) { throw err; }
//   console.log('Commentaire ajouté avec succès !');
//   // On se déconnecte de MongoDB maintenant
//   mongoose.connection.close();
// });


// RenionModel.find(null, function (err, comms) {
//   if (err) { throw err; }
//   // comms est un tableau de hash
//   console.log(comms);
//   // On se déconnecte de MongoDB maintenant
//   mongoose.connection.close();
// });

module.exports = {
  RenionModel:RenionModel,
  mongoose : mongoose,
  hostname : hostname
} 