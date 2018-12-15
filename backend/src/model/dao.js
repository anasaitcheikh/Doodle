const  db = require('./database')

/**
 * @constant {objet} mongoose - Correspond à l'appel du module mongoose.
*/
const mongoose = require('mongoose')

/**
 * @constant {objet} MongoObjectID  - Correspond au type ObjectID de mongo.
*/
var MongoObjectID = require("mongodb").ObjectID 



//connexion à la db
function connect(){
    mongoose.connect(db.hostname, { useNewUrlParser: true }, function(err) {
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

/*** POUR LES REUNIONS */

//récuperation tous les éléments de la bd
function findAllReunion(callback){
    connect()
    db.ReunionModel.find(null, function (err, results) {
      if (err) { console.log( err ) }
      // results est un tableau de hash
      //console.log(results)
      // On se déconnecte de MongoDB maintenant
      disconnect()
      callback(results)
    })
}
  
//récuperer un élément de la bd grace a sont id
function findReunion(id, callback){
    connect()
    db.ReunionModel.findOne({ _id: new MongoObjectID(id) }, function (error, result) {
        if (error) console.log( error )
        //console.log(result)
        disconnect()
        callback(result)
    })
}
  
//mettre a jour un élément de la bd  nb: le update ne marche pas
function updateReunion(id, callback){
    // db.ReunionModel.update(
    //    {"_id" : new MongoObjectID("5bf5c049fea9830a203e1efb")},
    //    {$set : {"title" : "reunion test update 2.0"}}
    // )
    callback({})
}

function deleteReunion(id, callback){
    callback({})
}

function createReunion(reunion, callback){
    callback({})
}

/*** POUR LES PARTICIPANTS */

function findAllParticipant(idReunion, callback){
    connect()
    db.ReunionModel.findOne({"_id": new MongoObjectID(idReunion)}, {"participant":1, "_id":0}, (err, results) => {
        if (err) { console.log(err) }
        if (!results) {
          console.log("element not found")
        }
        console.log(results)
        disconnect()
        callback(results)
    })
}
  
//récuperer un élément de la bd grace a sont id
function findParticipant(id, callback){
    callback({})
}
  
//mettre a jour un élément de la bd  nb: le update ne marche pas
function updateParticipant(id, callback){
    callback({})
}

function deleteParticipant(id, callback){
    callback({})
}

function createParticipant(participant, callback){
    callback({})
}

/*** POUR LES COMMENTAIRES */

function findAllComment(idReunion, callback){
    callback({})
}
  
//récuperer un élément de la bd grace a sont id
function findComment(id, callback){
    callback({})
}
  
//mettre a jour un élément de la bd  nb: le update ne marche pas
function updateComment(id, callback){
    callback({})
}

function deleteComment(id, callback){
    callback({})
}

function createComment(comment, callback){
    callback({})
}
/*** POUR LES USERS */

/**
 * 
 * @param {*} user => {login, mot de passe, et autres}
 * @param {*} callback => une fonction passée depuis l'api
 */
function createUser(user, callback){
    callback()
}

/**
 * 
 * @param {*} id => l'id du User
 * @param {*} callback => une fonction passée depuis l'api
 */
function findUser(id, callback){
    callback()
}

/**
 * 
 * @param {*} idUser => l'id de l'admin de la reunion
 * @param {*} callback => une fonction passée depuis l'api
 */
function findAllUser(idAdmin, callback){
    callback()
}

/**
 * 
 * @param {*} id => l'id du User
 * @param {*} callback => une fonction passée depuis l'api
 */
function updateUser(id, callback){
    callback()
}

/**
 * 
 * @param {*} id => l'id du User
 * @param {*} callback => une fonction passée depuis l'api
 */
function deleteUser(id, callback){
    callback()
}


module.exports = {
    findAllReunion : findAllReunion,
    findReunion : findReunion,
    updateReunion : updateReunion,
    createReunion : createReunion,

    findAllParticipant : findAllParticipant,
    findParticipant : findParticipant,
    updateParticipant : updateParticipant,
    createParticipant : createParticipant,

    findAllComment : findAllComment,
    findComment : findComment,
    updateComment : updateComment,
    createComment : createComment,

    findAllUser : findAllUser,
    findUser : findUser,
    updateUser : updateUser,
    createUser : createUser,
} 

