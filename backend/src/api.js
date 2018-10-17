const express = require('express')
const router = express.Router()

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

//events
router.get('/events', function(req, res) {
    res.status('404').send("Not found")
    res.end()
});

router.get('/events/:event_id', function(req, res) {
    res.status('404').send("Not found")
    res.end()
});

router.post('events', function(req, res) {
    res.status('404').send("Not found")
    res.end()
});

router.put('/events/:event_id', function(req, res) {
    res.status('404').send("Not found")
    res.end()
});

router.delete('/events/:id', function(req, res) {
    res.status('404').send("Not found")
    res.end()
});

//participants
router.get('/events/:event_id/participants', (req, res) => {

})

router.get('/events/:event_id/participants/:id_participant', (req, res) => {

})

router.post('/events/:event_id/participants', (req, res) => {
    
})

router.put('/events/:event_id/participants/:id_participant', (req, res) => {

})

router.delete('/events/:event_id/participants/:id_participant', (req, res) => {
    
})

//comments
router.get('/events/:event_id/comments', (req, res) => {

})

router.get('/events/:event_id/comments/:id_comment', (req, res) => {

})

router.post('/events/:event_id/comment', (req, res) => {
    
})

router.put('/events/:event_id/comments/:id_comment', (req, res) => {

})

router.delete('/events/:event_id/comments/:id_comment', (req, res) => {
    
})


/**
 * @résumé Receuille l'ensemble des demandes de ressources non disponible sur le serveur, 
 *         les traite et renvoie une page d'erreur à l'utilisateur pour l'informer de la non disponibilité de cette ressource.   
 * @param {string} route - La route vers la ressource recherchée.
 * @param {function} callback - La fonction appelée à la fin du traitement, elle prends en paramètre l'objet requêtte et l'objet reponse.
*/
router.get('*', function(req, res) {
    res.status('404').send("Not found")
    res.end()
});

  
module.exports = router;