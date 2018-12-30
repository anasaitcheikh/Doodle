/**
 * @constant {objet} mongoose - Correspond à l'appel du module mongoose.
*/
const mongoose = require('mongoose')

/**
 * @constant {string} hostname - Correspond à l'url de la bade de données mongo.
*/
const hostname = 'mongodb://localhost/middleware' 

const DateReunion = new mongoose.Schema({
                    date : { type: Date, default: Date.now },
                    hourStart : { type : String },
                    hourEnd : { type : String }
                 })  

const Comment = new mongoose.Schema({
                  name :  { type : String },
                  email : { type : String },
                  text : { type : String },
                  create_at : { type: Date, default: Date.now },
                  update_at : { type: Date, default: Date.now }
                })


const Participant = new mongoose.Schema({
                      name :  { type : String },
                      email : { type : String },
                      create_at : { type: Date, default: Date.now },
                      update_at : { type: Date, default: Date.now }
                    })

  const UserSchema = new mongoose.Schema({
                      name :  { type : String },
                      email : { type : String },
                      password : { type : String },
                      create_at : { type: Date, default: Date.now },
                      update_at : { type: Date, default: Date.now }
                    })


// Création du schéma pour les reunions
const ReunionSchema = new mongoose.Schema({
  title : { type : String },
  place : { type : String },
  note : { type : String },
  date : [DateReunion],
  addComment : { type : Boolean },
  maxParticipant : { type: Number, min: 1 },
  comment : [Comment],
  admin : Participant,
  participant : [Participant],
  create_at : { type: Date, default: Date.now },
  update_at : { type: Date, default: Date.now }
})
 

// Création du Model pour les commentaires
var ReunionModel = mongoose.model('reunion', ReunionSchema)


var UserModel = mongoose.model('user', UserSchema)
 

// On crée une instance du Model
var reunion = new ReunionModel()
reunion.title = 'reunion test 2.0'
reunion.place = 'Skype'
reunion.note = 'rdv pour la révision'
reunion.addComment = true
reunion.maxParticipant = 5
reunion.date.push({  
                    date: new Date().now,
                    hourStart : "8h00",
                    hourEnd : '10h00'
                  })
reunion.comment.push({
                      name : 'moub name 0',
                      email : 'moub email 0',
                      text : 'moub text',
                      create_at : new Date().now,
                      update_at : new Date().now
                    }) 
reunion.comment.push({
                      name : 'moub name 1',
                      email : 'moub email 1',
                      text : 'moub text',
                      create_at : new Date().now,
                      update_at : new Date().now
                    }) 
reunion.admin = { 
                 name :'moub name admin',
                 email : 'moub email admin',
                 create_at : new Date().now,
                 update_at : new Date().now
                }
reunion.participant.push({
                          name : 'moub participant 0',
                          email : 'moub email 0',
                          create_at : new Date().now,
                          update_at : new Date().now
                        })
reunion.participant.push({
                          name : 'moub participant 1',
                          email : 'moub email 1',
                          create_at : new Date().now,
                          update_at : new Date().now
                        })


var user = new UserModel()
user.name = 'moub user 0'
user.email = 'moub email user 0'
user.password = 'moub password user 0'
user.create_at = new Date().now
user.update_at = new Date().now

module.exports = {
  ReunionModel:ReunionModel,
  mongoose : mongoose,
  hostname : hostname,
  reunion : new ReunionModel(),
  user : new UserModel (),
  UserModel:UserModel,
}   

//On le sauvegarde dans MongoDB !
connect()
reunion.save(function (err) {
  if (err) { throw err }
  console.log('Reunion ajouté avec succès !')
  // On se déconnecte de MongoDB maintenant
  mongoose.connection.close()
}) 

//connexion à la db
function connect(){
  mongoose.connect(hostname, { useNewUrlParser: true }, function(err) {
    if (err) { 
     console.log(err)
     throw err
    }else{
     console.log("Connection to mongodb ok")
    }
  })
}