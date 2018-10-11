const express = require('express')
const router = express.Router()

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    var now = new Date()
    console.log( "Time "+now.getHours()+"h "+now.getMinutes());
    next();
});
/**
 * @résumé La route representant la demande de l'acceuil du site.
 * @param {string} route - La route vers la ressource recherchée. 
 * @param {function} callback - La fonction appelée à la fin du traitement, elle prends en paramètre l'objet requêtte et l'objet reponse.
*/
router.get('/', function(req, res) {
    res.status(200).send("Hello world")
});
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