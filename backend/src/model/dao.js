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
function findReunion(idReunion, callback){
    connect()
    db.ReunionModel.findOne({ _id: new MongoObjectID(idReunion) }, function (error, result) {
        if (error) console.log( error )
        //console.log(result)
        disconnect()
        callback(result)
    })
}
  
function updateReunion(reunion, callback){
    connect()
    db.ReunionModel.findOneAndUpdate(
                                    {"_id":  new MongoObjectID(reunion.id)},
                                    {"$set": {"title": reunion.title, "place": reunion.place, "note": reunion.note,
                                              "addComment": reunion.addComment, "maxParticipant": reunion.maxParticipant, "date": reunion.date, 
                                              "$.update_at": new Date().now }},
                                    {new:true},  
                                    (err, results) => {
        if (err) { console.log("errur->"); console.log(err) }
        if (!results) {
          console.log("element not found")
        }
        //console.log(results)
        disconnect()
        callback(results)
    })
}

function deleteReunion(idReunion, callback){
    connect()
    db.ReunionModel.findOneAndDelete(
        {"_id":  new MongoObjectID(idReunion)},
        (err, results) => {
            if (err) { console.log(err) }
            if (!results) { console.log("element not found") }
            //console.log(results)
            disconnect()
            callback(results)
    })
}

function createReunion(reunion, callback){
    // var reunionModel = newReunionModel()
    // reunionModel=reunion
    db.reunion.title = reunion.title
    db.reunion.place = reunion.place
    db.reunion.note = reunion.note
    db.reunion.addComment = reunion.addComment
    db.reunion.maxParticipant = reunion.maxParticipant
    db.reunion.date = reunion.date
    db.reunion.comment = reunion.comment
    db.reunion.admin = reunion.admin
    db.reunion.participant =reunion.participant
    connect()
    db.reunion.save(function (err, result) {
        if (err) { console.log(err) }
        if (!result) {
          console.log("element not create")
        }
        //console.log(results)
        disconnect()
        callback(result)
    })
}

/*** POUR LES PARTICIPANTS */

function findAllParticipant(idReunion, callback){
    connect()
    db.ReunionModel.findOne({"_id": new MongoObjectID(idReunion)}, {"participant":1, "_id":0}, (err, results) => {
        if (err) { console.log(err) }
        if (!results) {
          console.log("element not found")
        }
        //console.log(results)
        disconnect()
        callback(results)
    })
}
  
//récuperer un élément de la bd grace a sont id
function findParticipant(idReunion, idParticipant, callback){
    connect()
    db.ReunionModel.findOne({"_id": new MongoObjectID(idReunion)},
                            {"_id":0, 
                             "participant" : {$elemMatch : {"_id" : new MongoObjectID(idParticipant)} }
                            }, 
                            (err, results) => {
        if (err) { console.log(err) }
        if (!results) {
          console.log("element not found")
        }
        //console.log(results)
        disconnect()
        callback(results)
    })
}

function findParticipantWithEmail(idReunion, emailParticipant, callback){
    console.log('idReunion', idReunion)
    console.log('email', emailParticipant)
    connect()
    db.ReunionModel.findOne({"_id": new MongoObjectID(idReunion)},
                            {"_id":0, 
                             "participant" : {$elemMatch : {"email" : emailParticipant} }
                            }, 
                            (err, results) => {
        if (err) { console.log(err) }
        if (!results) {
          console.log("element not found")
        }
        console.log("element",results)
        disconnect()
        callback(results)
    })
}
  
//relis la doc sur findOneAndUpdate et findByIdAndUpdate
function updateParticipant(participant, callback){
    connect()
    db.ReunionModel.findOneAndUpdate(
                                    {"participant._id":  new MongoObjectID(participant.id)},
                                    {"$set": {"participant.$.name": participant.name, "participant.$.email": participant.email, "participant.$.update_at": new Date().now }},
                                    {new:true},  
                                    (err, results) => {
        if (err) { console.log(err) }
        if (!results) {
          console.log("element not found")
        }
        //console.log(results)
        disconnect()
        callback(results)
    })
}


function deleteParticipant(idRenion, idParticipant, callback){
    connect()
    db.ReunionModel.findOneAndUpdate(
                                    {"_id":  new MongoObjectID(idRenion),
                                     "participant._id":  new MongoObjectID(idParticipant)
                                    },
                                    { $pull: {"participant": { "_id": new MongoObjectID(idParticipant)}}},
                                    {new:true},  
                                    (err, results) => {
        if (err) { console.log(err) }
        if (!results) {
        console.log("element not found")
        }
        //console.log(results)
        disconnect()
        callback(results)
    })
}

function createParticipant(idRenion, participant, callback){
    connect()
    db.ReunionModel.findOneAndUpdate(
                                    {"_id":  new MongoObjectID(idRenion)},
                                    { $addToSet:{"participant":participant}},
                                    {new:true},  
                                    (err, results) => {
        if (err) { console.log(err) }
        if (!results) {
        console.log("element not add")
        }
        //console.log(results)
        disconnect()
        callback(results)
    })
}

/*** POUR LES COMMENTAIRES */

function findAllComment(idReunion, callback){
    connect()
    db.ReunionModel.findOne({"_id": new MongoObjectID(idReunion)}, {"comment":1, "_id":0}, (err, results) => {
        if (err) { console.log(err) }
        if (!results) {
          console.log("element not found")
        }
        //console.log(results)
        disconnect()
        callback(results)
    })
}
  
//récuperer un élément de la bd grace a sont id
function findComment(idReunion, idComment, callback){
    connect()
    db.ReunionModel.findOne({"_id": new MongoObjectID(idReunion)},
                            {"_id":0, 
                             "comment" : {$elemMatch : {"_id" : new MongoObjectID(idComment)} }
                            }, 
                            (err, results) => {
        if (err) { console.log(err) }
        if (!results) {
          console.log("element not found")
        }
        //console.log(results)
        disconnect()
        callback(results)
    })
}
  
//mettre a jour un élément de la bd  nb: le update ne marche pas
function updateComment(comment, callback){
    connect()
    db.ReunionModel.findOneAndUpdate(
                                    {"comment._id":  new MongoObjectID(comment.id)},
                                    {"$set": {"comment.$.name": comment.name, "comment.$.email": comment.email, "comment.$.text": comment.text, "comment.$.update_at": new Date().now }},
                                    {new:true},  
                                    (err, results) => {
        if (err) { console.log(err) }
        if (!results) {
          console.log("element not found")
        }
        //console.log(results)
        disconnect()
        callback(results)
    })
}

function deleteComment(idRenion, idComment, callback){
    connect()
    db.ReunionModel.findOneAndUpdate(
                                    {"_id":  new MongoObjectID(idRenion)},
                                    { $pull: {"comment": { "_id": new MongoObjectID(idComment)}}},
                                    {new:true},  
                                    (err, results) => {
        if (err) { console.log(err) }
        if (!results) {
        console.log("element not found")
        }
        //console.log(results)
        disconnect()
        callback(results)
    })
}

function createComment(idRenion, comment, callback){
    connect()
    db.ReunionModel.findOneAndUpdate(
                                    {"_id":  new MongoObjectID(idRenion)},
                                    { $addToSet:{"comment":comment}},
                                    {new:true},  
                                    (err, results) => {
        if (err) { console.log(err) }
        if (!results) {
        console.log("element not add")
        }
        //console.log(results)
        disconnect()
        callback(results)
    })
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
    deleteReunion : deleteReunion,

    findAllParticipant : findAllParticipant,
    findParticipant : findParticipant,
    findParticipantWithEmail : findParticipantWithEmail,
    updateParticipant : updateParticipant,
    createParticipant : createParticipant,
    deleteParticipant : deleteParticipant,

    findAllComment : findAllComment,
    findComment : findComment,
    updateComment : updateComment,
    createComment : createComment,
    deleteComment : deleteComment,

    findAllUser : findAllUser,
    findUser : findUser,
    updateUser : updateUser,
    createUser : createUser,
    deleteUser : deleteUser,
} 


// findAllParticipant('5c1acc97f4b824298854bb44', (participants)=>{  console.log('findAllParticipant') ;console.log(participants)})

//findParticipant('5c1acc97f4b824298854bb44','5c1acc97f4b824298854bb4a', (participant)=>{ console.log('findParticipant') ;console.log(participant)})

// findParticipantWithEmail('5c1cf5a186036a5a647c5f04','part1@part.com', (participant)=>{ console.log('findParticipantWithEmail') ;console.log(participant)})

// updateParticipant(
//     { 
//         id:'5c1acc97f4b824298854bb4a',
//         name:"moub participant 1.0.1 zzzxxxdiehi",
//         email:"moub email 1.0.1 zzzxxxfeoiufue"
//     },
//     (participant)=>{ console.log('UpdateParticipant') ;console.log(participant)}
// )

deleteParticipant('5c1acc97f4b824298854bb44', '5c1acc97f4b824298854bb49', (participant)=>{ console.log('deleteParticipant') ;console.log(participant)})

// createParticipant(
//     '5c1accac39540f2f98a94098', 
//     {
//         name : 'moub participant create false',
//         email : 'moub email create false',
//         create_at : new Date().now,
//         update_at : new Date().now
//     },
//     (participant)=>{ console.log('createParticipant') ;console.log(participant)}
// )


//findAllComment('5c1acc97f4b824298854bb44', (comments)=>{  console.log('findAllComment') ;console.log(comments)})

//findComment('5c1acc97f4b824298854bb44','5c1acc97f4b824298854bb46', (comment)=>{ console.log('findComment') ;console.log(comment)})

// updateComment(
//     { 
//         id:'5c1acc97f4b824298854bb46',
//         name:"moub comment 1.0.1 zzzxxx",
//         email:"moub email 1.0.1 zzzxxx",
//         text : "commentaire modifie"
//     },
//     (comment)=>{ console.log('UpdateComment') ;console.log(comment)}
// )

//deleteComment('5c1acc97f4b824298854bb44', '5c1acc97f4b824298854bb47', (comment)=>{ console.log('deleteComment') ;console.log(comment)})

// createComment(
//     '5c1acc97f4b824298854bb44', 
//     {
//         name : 'moub comment create 2.0',
//         email : 'moub email create 2.0',
//         text : "text comment create 2.0",
//         create_at : new Date().now,
//         update_at : new Date().now
//     },
//     (comment)=>{ console.log('createComment') ;console.log(comment)}
// )



//findAllReunion((reunions)=>{  console.log('findAllReunion') ;console.log(reunions)})

//findReunion('5c1acc97f4b824298854bb44', (reunion)=>{ console.log('findReunion') ;console.log(reunion)})


// updateReunion(
//     { 
//         id:'5c1accac39540f2f98a94099',
//         title : "titre reunion",
//         place : "place reunion",
//         note : "note reunion",
//         maxParticipant : 20,
//         addComment : true,
//         date : [{  
//             date: new Date().now,
//             hourStart : "8h30",
//             hourEnd : '12h00'
//           }]
//     },
//     (reunion)=>{ console.log('UpdateReunion') ;console.log(reunion)}
// )

//deleteReunion('5c1accaff6d1d72c2c487112', (reunion)=>{ console.log('deleteReunion') ;console.log(reunion)})

// createReunion( 
//     {
//         "date" : [ 
//             {
//                 "_id" : new MongoObjectID("5c1c341d9339972f481093c9"),
//                 "date" : new Date().now,
//                 "hourStart" : "8h30",
//                 "hourEnd" : "12h00"
//             }
//         ],
//         "comment" : [ 
//             {
//                 "_id" : new MongoObjectID("5c1accac39540f2f98a9409b"),
//                 "name" : "moub name 0",
//                 "email" : "moub email 0",
//                 "text" : "moub text",
//                 "create_at" : new Date().now,
//                 "update_at" : new Date().now
//             }, 
//             {
//                 "_id" : new MongoObjectID("5c1accac39540f2f98a9409c"),
//                 "name" : "moub name 1",
//                 "email" : "moub email 1",
//                 "text" : "moub text",
//                 "create_at" : new Date().now,
//                 "update_at" : new Date().now
//             }
//         ],
//         "participant" : [ 
//             {
//                 "_id" : new MongoObjectID("5c1accac39540f2f98a9409f"),
//                 "name" : "moub participant 1",
//                 "email" : "moub email 1",
//                 "create_at" : new Date().now,
//                 "update_at" : new Date().now
//             }, 
//             {
//                 "_id" : new MongoObjectID("5c1ae55497acb414985ee0a4"),
//                 "name" : "moub participant create",
//                 "email" : "moub email create",
//                 "create_at" : new Date().now,
//                 "update_at" : new Date().now
//             }
//         ],
//         "create_at" : new Date().now,
//         "update_at" : new Date().now,
//         "title" : "titre reunion",
//         "place" : "place reunion",
//         "note" : "note reunion",
//         "addComment" : true,
//         "maxParticipant" : 20,
//         "admin" : {
//             "_id" : new MongoObjectID("5c1accac39540f2f98a9409d"),
//             "name" : "moub name dao 0",
//             "email" : "moub email dao 0",
//             "create_at" : new Date().now,
//             "update_at" : new Date().now
//         }
//     },
//     (reunion)=>{ console.log('createReunion') ;console.log(reunion)}
// )


