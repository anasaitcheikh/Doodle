const express = require('express')
const api = express.Router()

const {isJson, requestErrorMsg, responseStatus} = require('./utils/helper')
const  dao = require('./model/dao');

const tokenHandler = require('./authentification/tokenHandler')



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
    
    const authorizationHeader = req.headers['authorization'];
    console.log('authorizationHeader', authorizationHeader)

    /*if ((typeof authorizationHeader === 'undefined') && (req.url !== '/auth')){
        res.status('401').end();
    }
    else if(req.url !== '/auth'){
        const bearerToken = authorizationHeader.split(' ');
        
        const bearer = bearerToken[1].trim();
        console.log('bearerToken', bearer)
        console.log(tokenHandler.verifyJWTToken(bearer))
    }
    else if(typeof authorizationHeader !== 'undefined'){
        const bearerToken = authorizationHeader.split(' ');
        const bearer = bearerToken[1];
        decodedToken = tokenHandler.verifyJWTToken(bearer)
        console.log(decodedToken)
        
    }*/
    next();
    
});

var jsonParse = (req, res, next) => {

    if(isJson(req.body)){
        next()
    }
    else{
        console.log(req.body)
        res.status('403').json(
            {
            status: responseStatus.fail,
            message: requestErrorMsg.jsonMalformed,
            data: null
        })
    }
}

api.post('/auth', function(req, res, next){
    const email = req.body.data.email;
    const password = req.body.data.password;

    db.findUser({email, password}, (user) => {
        let msg = {};
        if(user !== undefined){
            const session = {
                sessionData: {
                    user: 'hadji'
                }
            }
            const token = tokenHandler.createJWToken(session);
            msg.data = token;
            res.json(data);
        }else{
            res.status('404').end();
        }
    })
});



//reunion open

api.post('/open/reunions', (req, res) => {
    const reqBodyData = req.body.data;
    if(reqBodyData == undefined){
        res.status('400');
    }

    let date=reqBodyData.reunion.date; //generaliser cela pour les autre date
    date[0].date= new Date(date[0].date);

    let reunion = {};
    reunion.admin = reqBodyData.reunion.admin;
    reunion.title = reqBodyData.reunion.title;
    reunion.place = reqBodyData.reunion.place;
    reunion.note = reqBodyData.reunion.note;
    reunion.date = date;
    const participants = reqBodyData.reunion.participants;
    reunion.participant = (participants === undefined) ? {} : participants;
    reunion.comment = {};
    reunion.addComment = reqBodyData.reunion.addComment;
    reunion.maxParticipant = reqBodyData.reunion.maxParticipant;
    

    dao.createReunion(reunion, (reunionAdded) => {
        console.log("return reunion", reunionAdded)
        if(reunionAdded === undefined){
            res.status('403').end();
        }

        const idReunion = reunionAdded._id;
    
        const session = {
            sessionData: {
                name: reunion.admin.name,
                admin: reunion.admin.email,
                participant: reunion.admin.email,
                idReunion: idReunion
            }
        }

        try{
            const token = tokenHandler.createJWToken(session, true);
            res.json({
                data: {
                    token: token
                }
            })
        }
        catch(error){
            // rollback database
            res.status('404').end();
        } 
    });
})

api.get('/open/reunions/:token', (req, res) => {
    const token = req.params.token;
    try{
        const session = tokenHandler.verifyJWTToken(token, true);

        dao.findReunion(session.sessionData.idReunion, (reunion) => {
            if(reunion === null){
                res.status('404').end();
            }
            else{
                reunion._id=null
                reunion.__v=null
                res.json(reunion);
            }
        })
    }
    catch(error){
        res.status('404').end();
    }
})

api.put('/open/reunions', (req, res) => {
    try{
        const reqBodyData = req.body.data;
        const session = tokenHandler.verifyJWTToken(reqBodyData.token, true);
        

        let reunion = {};
        reunion.id = session.sessionData.idReunion
        reunion.title = reqBodyData.reunion.title;
        reunion.place = reqBodyData.reunion.place;
        reunion.note = reqBodyData.reunion.note;
        reunion.date = reqBodyData.reunion.date;
        reunion.addComment = reqBodyData.reunion.addComment;
        reunion.maxParticipant = reqBodyData.reunion.maxParticipant;

        reunion.idReunion = session.sessionData.idReunion;
        const emailAdmin = session.sessionData.admin.email;

        //console.log("session", session.sessionData)
        if(emailAdmin !== undefined){
            dao.updateReunion(reunion, (reunionUpdate) => {
                if(reunionUpdate === null){
                    res.status('404').end();
                }
                else{
                    res.status('200').end();
                }
            })
        }
        else{
            res.status('401').end();
        }
    }
    catch(error){
        res.status('401').end("token ko");
    }
})

api.delete('/open/reunions', (req, res) => {
    try{
        const token = req.body.data.token;
        const session = tokenHandler.verifyJWTToken(token, true);

        const idReunion = session.sessionData.idReunion;
        const emailAdmin = session.sessionData.admin.email;

        if(emailAdmin !== undefined){
            dao.deleteReunion(idReunion, (reunionDelete) => {
                if(reunionDelete === null){
                    res.status('403').end();
                }
                else{
                    res.status('200').end();
                }
            })
        }
        else{
            res.status('401').end();}
    }
    catch(error){
        res.status('401').end();
    }
})

api.post('/open/reunions/:id_reunion/participants', (req, res) => {
    try{
        const reqBodyData = req.body.data;
        const token = reqBodyData.token;
        const session = tokenHandler.verifyJWTToken(token, true);
        
        if(session.sessionData.admin !== undefined){
            const idReunion = req.params.id_reunion;

            let participant = {};
            participant.email = reqBodyData.participant.email;
            participant.name = reqBodyData.participant.name;

            dao.findParticipantWithEmail(idReunion, participant.email, (resFind) => {
                if(resFind.participant.length !== 0){
                    res.status('403').end('This email is already taken')
                }
                else{
                    dao.createParticipant(idReunion, participant, (participantAdded) => {
                        if(participantAdded === (undefined || null || [])){
                            res.status('403').end('error')
                        }
                        else{
                            const participants = participantAdded.participant;
                            const session = {
                                sessionData: {
                                    name: participant.name,
                                    participant: participant.email,
                                    idReunion: idReunion,
                                    idParticipant: participants[participants.length-1]._id
                                }
                            }
                            const token = tokenHandler.createJWToken(session, true)
                            const response = {
                                data: {
                                    participant: {
                                        _id: session.sessionData.idParticipant
                                    },
                                    token: token
                                }
                            }
                            res.json(response);
                        }
                    })
                }
            });
        }
        else{
            res.status('401');
        }
    }
    catch(error){
        res.status('401');
    }
})

api.put('/open/reunions/:id_reunion/participants/:id_participant', (req, res) => {
    try{
        const reqBodyData = req.body.data;
        const token = reqBodyData.token;
        const session = tokenHandler.verifyJWTToken(token, true);

        if(session.sessionData.idReunion === req.params.id_reunion){
            const idReunion = req.params.id_reunion;
            let participant = {};
            participant.id = req.params.id_participant;
            participant.email = reqBodyData.participant.email;
            participant.name = reqBodyData.participant.name;

            if(session.sessionData.admin !== undefined){
                dao.findParticipant(idReunion, participant.id, (resFind) => {
                    if(resFind.participant.length === 0){
                        res.status('403').end();
                    }
                    else{
                        dao.findParticipantWithEmail(idReunion, participant.email, (resFindEmail) => {
                            console.log('resFindEmail.participant', resFindEmail.participant[0]._id)
                            if(resFindEmail.participant.length != 0){
                                if(resFindEmail.participant[0]._id != participant.id){
                                    res.status('403').end('This email is already taken')
                                }
                                else{
                                    dao.updateParticipant(participant, (resUpdate) => {
                                        console.log('resUpdate', resUpdate)
                                        if(resUpdate === {}){
                                            res.status('304').end();
                                        }
                                        else{
                                            const session = {
                                                sessionData: {
                                                    name: participant.name,
                                                    participant: participant.email,
                                                    idReunion: idReunion,
                                                    idParticipant: participant.id
                                                }
                                            }
                                            const newToken = tokenHandler.createJWToken(session, true)
                                            res.json({
                                                data: {
                                                    token: newToken
                                                }
                                            });
                                        }
                                    }) 
                                }
                            }
                            else{
                                dao.updateParticipant(participant, (resUpdate) => {
                                    console.log('resUpdate', resUpdate)
                                    if(resUpdate === {}){
                                        res.status('304').end();
                                    }
                                    else{
                                        const session = {
                                            sessionData: {
                                                name: participant.name,
                                                participant: participant.email,
                                                idReunion: idReunion,
                                                idParticipant: participant.id
                                            }
                                        }
                                        const newToken = tokenHandler.createJWToken(session, true)
                                        res.json({
                                            data: {
                                                token: newToken
                                            }
                                        });
                                    }
                                }) 
                            }
                        })
                    }
                })
            }
            else if(session.sessionData.idParticipant !== undefined){
                if(session.sessionData.idParticipant != participant.id){
                    res.status('401').end()
                }
                else{
                    dao.findParticipantWithEmail(idReunion, participant.email, (resFindEmail) => {
                        if(resFindEmail.participant.length != 0){
                            if(resFindEmail.participant[0]._id != participant.id){
                                res.status('403').end('This email is already taken')
                            }
                            else{
                                dao.updateParticipant(participant, (resUpdate) => {
                                    if(resUpdate === {}){
                                        res.status('304').end();
                                    }
                                    else{
                                        const session = {
                                            sessionData: {
                                                name: participant.name,
                                                participant: participant.email,
                                                idReunion: idReunion,
                                                idParticipant: participant.id
                                            }
                                        }
                                        const newToken = tokenHandler.createJWToken(session, true)
                                        res.json({
                                            data: {
                                                token: newToken
                                            }
                                        });
                                    }
                                }) 
                            }
                        }
                        else{
                            dao.updateParticipant(participant, (resUpdate) => {
                                if(resUpdate === {}){
                                    res.status('304').end();
                                }
                                else{
                                    const session = {
                                        sessionData: {
                                            name: participant.name,
                                            participant: participant.email,
                                            idReunion: idReunion,
                                            idParticipant: participant.id
                                        }
                                    }
                                    const newToken = tokenHandler.createJWToken(session, true)
                                    res.json({
                                        data: {
                                            token: newToken
                                        }
                                    });
                                }
                            }) 
                        }
                    })
                }
            }
            else{
                res.status('500').end();
            }
        }
        else{
            res.status('401');
        }
    }
    catch(error){
        res.status('401');
    }
})

api.delete('/open/reunions/:id_reunion/participants/:id_participant', (req, res) => {
    try{
        const reqBodyData = req.body.data;
        const token = reqBodyData.token;
        const session = tokenHandler.verifyJWTToken(token, true);

        if(session.sessionData.idReunion === req.params.id_reunion){
            const idReunion = req.params.id_reunion;
            const idParticipant = req.params.id_participant;

            if(session.sessionData.admin !== undefined){
                dao.deleteParticipant(idReunion, idParticipant, (resDelete) => {
                    console.log('resDelete', resDelete)
                    if(resDelete == null){
                        res.status('404').end()
                    }
                    else{
                        res.status('200').end()
                    }
                })
            }
            else if(session.sessionData.participant !== undefined){
                dao.findParticipant(idReunion, idParticipant, (resFind) => {
                    if(resFind.participant.length === 0){
                        res.status('404').end()
                    }
                    else{
                        if(resFind.participant[0]._id == session.sessionData.idParticipant){
                            dao.deleteParticipant(idReunion, session.sessionData.idParticipant, (resDelete) => {
                                if(resDelete == null){
                                    res.status('404').end()
                                }
                                else{
                                    res.status('200').end()
                                }
                            })
                        }
                        else{
                            res.status('401').end()
                        }
                    }
                })
            }
            else{
                res.status('500').end()
            }
        }
        else{
            res.status('401').end();
        }
    }
    catch(error){
        res.status('401').end();
    }
})

api.post('/open/reunions/:id_reunion/comments', (req, res) => {
    try{
        const reqBodyData = req.body.data;
        const token = reqBodyData.token;
        const session = tokenHandler.verifyJWTToken(token, true);

        const idReunion = req.params.id_reunion;

        if(session.sessionData.participant !== undefined && idReunion == session.sessionData.idReunion){

            let comment = {};
            comment.name = session.sessionData.name
            comment.email = session.sessionData.participant;
            comment.text = reqBodyData.text;

            dao.createComment(idReunion, comment, (resCreate) => {
                if(resCreate === {}){
                    res.status('304').end()
                }
                else{
                    res.status('200').end()
                }
            })
        }
        else{
            res.status('401');
        }
    }
    catch(error){
        res.status('401');
    }
})

api.put('/open/reunions/:id_reunion/comments/:id_comment', (req, res) => {
    try{
        const reqBodyData = req.body.data;
        const token = reqBodyData.token;
        const session = tokenHandler.verifyJWTToken(token, true);
        const idReunion = req.params.id_reunion;

        if(session.sessionData.participant !== undefined && idReunion == session.sessionData.idReunion){
            let comment = {};
            comment.id = idReunion;
            comment.name = session.sessionData.name;
            comment.text = reqBodyData.text;
            comment.email = session.sessionData.participant;
            
            dao.updateComment(comment, () => {
                
            })
            res.status('200');
        }
        else{
            res.status('401');
        }
    }
    catch(error){
        res.status('401');
    }
})

api.delete('/open/reunions/:id_reunion/comments/:id_comment', (req, res) => {
    try{
        const token = req.body.data.token;
        const session = tokenHandler.verifyJWTToken(token, true);

        if(session.sessionData.admin !== undefined  || session.sessionData.participant !== undefined){
            const idReunion = req.params.id_reunion;
            const idComment = req.params.id_comment;

            //requête bd pour supprimer
            res.status('200');
        }
        else{
            res.status('401');
        }
    }
    catch(error){
        res.status('401');
    }
})

//reunions
api.get('/reunions', function(req, res) {
    db.findAll((reunions) => {
            console.log(`reunions: ${reunions}`)
            res.status('200')
               .json(
                {
                    status: responseStatus.success,
                    data: reunions
                }
            )
        }
    )
});

api.get('/reunions/:reunion_id', function(req, res) {
    reunionId = req.params.reunion_id
    db.find(reunionId, 
        (reunion) => {
            console.log(`reunion: ${reunion}`)
            if(reunion){
                res.status('200')
                   .json(
                    {
                        status: responseStatus.success,
                        data: reunion
                    }
                )
            }
            else{
                res.status('404')
                   .json(
                    {
                        status: responseStatus.fail,
                        message: requestErrorMsg.reunionNotFound,
                        data: reunion
                    }
                )
            }
        }
    )
});

api.post('/reunions', function(req, res) {
    reunion = req.body
    //check les propriétés
    connection.addReunion(reunion)
    res.status('200')
});

api.put('/reunions/:reunion_id', function(req, res) {
    reunionId = req.params.reunion_id
    oldReunion = connection.getReunion(reunionId)
    newReunion = req.body

    status = connection.updateReunion(reunionId, newReunion)
    res.status('200')
});

api.delete('/reunions/:reunion_id', function(req, res) {
    reunionId = req.params.reunion_id
    status = connection.removeReunion(reunionId)

    if(status){
        res.status('200').end(success)
    }
    else{ 
        res.status('404').end(error)
    }
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
/*api.get('*', function(req, res) {
    res.status('404').send("Page Not found")
    res.end()
});

function verifyToken(){
    jsonParse.verifyToken()
}


// //la connexion à la bd
// db.connect()

// //récuperation tous les éléments de la bd
// db.findAll((data)=>console.log(data))

// //mettre a jour un élément de la bd
// db.update()

// //récuperer un élément de la bd grace a sont id
// db.find("5bf5c049fea9830a203e1efb", (data)=>console.log(data))*/

module.exports = api;