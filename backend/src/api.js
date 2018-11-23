const express = require('express')
const api = express.Router()

const  db = require('./model/database')

/**
 * @constant {objet} mongoose - Correspond à l'appel du module mongoose.
*/
const mongoose = require('mongoose')

/**
 * @constant {objet} MongoObjectID  - Correspond au type ObjectID de mongo.
*/
var MongoObjectID = require("mongodb").ObjectID 

// middleware that is specific to this api
api.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

// check data for POST, PUT
api.post('*', function(req, res){
    try{
        JSON.parse(req.body)
        res.end("OK")
    }
    catch(e){
        res.end("KO")
    }
});

//reunions
api.get('/reunions', function(req, res) {
});

api.get('/reunions/:reunion_id', function(req, res) {
});

api.post('/reunions', function(req, res) {
});

api.put('/reunions/:reunion_id', function(req, res) {
});

api.delete('/reunions/:reunion_id', function(req, res) {
});

//participants
api.get('/reunions/:reunion_id/participants', (req, res) => {
    db.connect()
    db.ReunionModel.findOne({"_id": new MongoObjectID(req.params.reunion_id)}, {participant:1, _id:0}, (err, data) => {
      if (err) { console.log(err) }
      if (!data) {
        console.log("element not found")
      }
      console.log(data)
      db.disconnect()
      res.status(200).json({ route : `get  /reunions/${req.params.reunion_id}/participants `,
                             data : data})
    })
})

api.get('/reunions/:reunion_id/participants/:participant_id', (req, res) => {
    // db.connect()
    // db.ReunionModel.findOne({"_id": new MongoObjectID(req.params.participant_id)}, {_id:0}, (err, data) => {
    //   if (err) { console.log(err) }
    //   if (data.length==0) {
    //     console.log("element not found")
    //   }
    //   console.log(data)
    //   db.disconnect()
    //   res.status(200).json({ route : `get  /reunions/${req.params.reunion_id}/participants/${req.params.participant_id} `,
    //                          data : data})
    // })
})

api.post('/reunions/:reunion_id/participants', (req, res) => {
    res.status(200).json({ data : 'post /reunions/:reunion_id/participants'})
})

api.put('/reunions/:reunion_id/participants/:participant_id', (req, res) => {
    res.status(200).json({ data : 'put /reunions/:reunion_id/participants/:participant_id'})
})

api.delete('/reunions/:reunion_id/participants/:id_participant', (req, res) => {
    res.status(200).json({ data : 'delete /reunions/:reunion_id/participants/:id_participant'})   
})

//comments
api.get('/reunions/:reunion_id/comments', (req, res) => {

    res.status(200).json({ data : 'get /reunions/:reunion_id/comments'}) 
})

api.get('/reunions/:reunion_id/comments/:id_comment', (req, res) => {

    res.status(200).json({ data : 'get /reunions/:reunion_id/comments/:id_comment'})
})

api.post('/reunions/:reunion_id/comment', (req, res) => {
    
  res.status(200).json({ data : 'post /reunions/:reunion_id/comment'})  
})

api.put('/reunions/:reunion_id/comments/:id_comment', (req, res) => {
  res.status(200).json({ data : 'put /reunions/:reunion_id/comments/:id_comment'})  
})

api.delete('/reunions/:reunion_id/comments/:id_comment', (req, res) => {
  res.status(200).json({ data : 'delete /reunions/:reunion_id/comments/:id_comment'})  
})


/**
 * @résumé Receuille l'ensemble des demandes de ressources non disponible sur le serveur, 
 *         les traite et renvoie une page d'erreur à l'utilisateur pour l'informer de la non disponibilité de cette ressource.   
 * @param {string} route - La route vers la ressource recherchée.
 * @param {function} callback - La fonction appelée à la fin du traitement, elle prends en paramètre l'objet requêtte et l'objet reponse.
*/
api.get('*', function(req, res) {
    res.status('404').send("Page Not found")
    res.end()
});


// //la connexion à la bd
// db.connect()

// //récuperation tous les éléments de la bd
// db.findAll((data)=>console.log(data))

// //mettre a jour un élément de la bd
// db.update()

// //récuperer un élément de la bd grace a sont id
// db.find("5bf5c049fea9830a203e1efb", (data)=>console.log(data))

module.exports = api;