/**
 * @constant {objet} mongoose - Correspond à l'appel du module mongoose.
*/
const mongoose = require('mongoose')

/**
 * @constant {string} hostname - Correspond à l'url de la bade de données mongo.
*/
const hostname = 'mongodb://localhost/middleware' 

/**
 * @constant {objet} MongoObjectID  - Correspond au type ObjectID de mongo.
*/
var MongoObjectID = require("mongodb").ObjectID 

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

//deconnexion à la db
//verifier si la deconnection se fais bien
function disconnect(){
  try{
    mongoose.connection.close()
    console.log("Disconnect to mongodb ok")
  }catch(error) {
    console.log("Disconnect to mongodb Error")
    console.log(error)
  }  
}

//récuperation tous les éléments de la bd
function findAll(callback){
  ReunionModel.find(null, function (err, results) {
    if (err) { throw err }
    // results est un tableau de hash
    //console.log(results)
    // On se déconnecte de MongoDB maintenant
    disconnect()
    callback(results)
  })
}

//récuperer un élément de la bd grace a sont id
function find(id, callback){
  ReunionModel.findOne({ _id: new MongoObjectID(id) }, function (error, result) {
      if (error) throw error
      //console.log(result)
      disconnect()
      callback(result)
  })
}

//mettre a jour un élément de la bd  nb: le update ne marche pas
function update(){
  ReunionModel.update(
     {"_id" : new MongoObjectID("5bf5c049fea9830a203e1efb")},
     {$set : {"title" : "reunion test update 2.0"}}
  )
}

//supprimer un élément de la bd grace a sont id
// function delete(id){

// }


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
 

// On crée une instance du Model
var reunion = new ReunionModel()
reunion.title = 'reunion test 2.0'
reunion.place = 'Skype'
reunion.note = 'rdv pour la révision'
reunion.addComment = true
reunion.maxParticipant = 5
reunion.date.push({  
                    date: new Date().now,
                    hourStart : "begin",
                    hourEnd : 'end'
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

module.exports = {
  ReunionModel:ReunionModel,
  mongoose : mongoose,
  hostname : hostname,
  connect : connect, 
  disconnect : disconnect,
  findAll : findAll,
  find : find,
  update : update
} 

// On se connecte à la base de données
// N'oubliez pas de lancer ~/mongodb/bin/mongod dans un terminal !
// mongoose.connect(hostname, { useNewUrlParser: true }, function(err) {
//   if (err) { 
//    console.log(err)
//    throw err
//   }else{
//    console.log("Connection to mongodb ok")
//     // db.collection("reunions").find().toArray(function (error, results) {
//     //     if (error) throw error

//     //     results.forEach(function(obj, i) {
//     //         console.log(
//     //             "ID : "  + obj._id.toString() + "\n" +
//     //             "Titre : " + obj.title + "\n"          
//     //         )
//     //     })
//     // })
    
//     // db.collection("reunions").findOne({ _id: new MongoObjectID("5bc0d325980bc006a0ab91b0") }, function (error, results) {
//     //     if (error) throw error
//     //         console.log(results)
//     // })

//   }
// })

//On le sauvegarde dans MongoDB !
// connect()
// reunion.save(function (err) {
//   if (err) { throw err }
//   console.log('Commentaire ajouté avec succès !')
//   // On se déconnecte de MongoDB maintenant
//   mongoose.connection.close()
// })


// ReunionModel.find(null, function (err, comms) {
//   if (err) { throw err }
//   // comms est un tableau de hash
//   console.log(comms)
//   // On se déconnecte de MongoDB maintenant
//   mongoose.connection.close()
// })