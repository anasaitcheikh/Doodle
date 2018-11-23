/**
 * @constant {objet} express - Correspond à l'appel du module express.
*/
const express = require('express')

/**
 * @constant {objet} app - Correspond à l'instanciation du module express.
*/
const app = express()



/**
 * @constant {int} port - Correspond au port utiliser pour la création du serveur.
*/
const port = 8080

/**
 * @constant {objet} api - Correspond à l'appel du module api.
*/
const api = require('./api')

const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


/**
 * @résumé Appeler pour la création du serveur.
 * @param {string} port - Le port à utiliser pour la création du serveur
 * @param {function} callback - La fonction appelée à la fin du traitement, elle prends en paramètre une erreur. Si l'erreur est présent elle l'affiche sur la console, 
 								dans le cas contraire elle affiche la création éffectif du serveur sur la console.
*/
app.listen(process.env.PORT || port, (err) => {
        if (err) { return console.log('something bad happened', err) }
        console.log(`server is listening on ${process.env.PORT || port}`)
    })



// délégation du routing de l'api au module api
app.use('/api', api)






// connection.mongoose.connect(connection.hostname, { useNewUrlParser: true }, function(err) {
//   if (err) { 
//   	console.log(err)
//   	throw err
//   }else{
//   	console.log("Connection to mongodb ok")

//   }
// })

// connection.ReunionModel.find(null, function (err, data) {
//   if (err) { throw err; }
//   // data est un tableau de hash
//   if (data.length==0) {
//     console.log("element not found")
//   }
//   console.log(data);
//   // On se déconnecte de MongoDB maintenant
//   mongoose.connection.close();
// });
