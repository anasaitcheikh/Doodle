const express = require('express')
const api = express.Router()

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
})

api.get('/reunions/:reunion_id/participants/:participant_id', (req, res) => {
})

api.post('/reunions/:reunion_id/participants', (req, res) => {
})

api.put('/reunions/:reunion_id/participants/:participant_id', (req, res) => {
})

api.delete('/reunions/:reunion_id/participants/:id_participant', (req, res) => {
    
})

//comments
api.get('/reunions/:reunion_id/comments', (req, res) => {

})

api.get('/reunions/:reunion_id/comments/:id_comment', (req, res) => {

})

api.post('/reunions/:reunion_id/comment', (req, res) => {
    
})

api.put('/reunions/:reunion_id/comments/:id_comment', (req, res) => {

})

api.delete('/reunions/:reunion_id/comments/:id_comment', (req, res) => {
    
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

module.exports = api;