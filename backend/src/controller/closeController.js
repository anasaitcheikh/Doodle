
const express = require('express')
const closeController = express.Router()

const { sendMailToParticipants, sendMail, sendMailToUsers } = require('../utils/helper')
const dao = require('../model/dao')

const tokenHandler = require('../authentification/tokenHandler')

const md5 = require('js-md5');

let session
let reqBodyData
let token

closeController.use((req, res, next) => {
    reqBodyData = req.body.data
    
    //console.log("req.params.token ->",req.params)
    if (reqBodyData == undefined) {
        console.log("bad request")
        next()
    }
    // else if(req.params.token != undefined){
    //     token = reqBodyData.token
    //     try {
    //         session = tokenHandler.verifyJWTToken(token)
    //         //res.json(session)
    //         next()
    //     }
    //     catch (error) {
    //         res.status('400').end('Bad Authentication Token')
    //     }
    // }
    else {
        if (req.url == '/auth' || req.url == '/users') {
            next()
        }
        else {
            token = reqBodyData.token

            if (token == undefined) {
                res.status('400').end('Authentication Token not provided')
            }
            else {
                try {
                    session = tokenHandler.verifyJWTToken(token)
                    //res.json(session)
                    next()
                }
                catch (error) {
                    res.status('400').end('Bad Authentication Token')
                }
            }
        }
    }
})

// authentificaton
closeController.post('/auth', function (req, res, next) {
    dao.findUserByEmail(reqBodyData.user.email, (resFind) => {
        if (resFind == null) {
            res.status('401').end('Wrong Email')
        }
        else {
            if (resFind.password != md5(reqBodyData.user.password)) {
                res.status('401').end('Wrong Password')
            }
            else {
                try {
                    session = {
                        sessionData: {
                            id: resFind._id,
                            email: resFind.email,
                            name: resFind.name
                        }
                    }

                    token = tokenHandler.createJWToken(session)

                    dao.findReunionCreateBy(resFind.email, (ownReunion) => {
                        dao.findReunionForGuest(resFind.email, (guestedReunion) => {
                            res.json({
                                data: {
                                    user: {
                                        id: resFind._id,
                                        email: resFind.email,
                                        name: resFind.name
                                    },
                                    reunions: {
                                        owner: ownReunion,
                                        guest: guestedReunion
                                    },
                                    token: token
                                }
                            })
                        })
                    })
                }
                catch (error) {
                    res.status('500').end()
                }
            }
        }
    })
})

//create user
closeController.post('/users', (req, res) => {
    const user = {
        name: reqBodyData.user.name,
        email: reqBodyData.user.email,
        password: md5(reqBodyData.user.password)
    }

    dao.findUserByEmail(user.email, (resFind) => {
        if (resFind != null) {
            res.status('400').end('Email is already taken')
        }
        else {
            dao.createUser(user, (userAdded) => {
                if (userAdded == null) {
                    res.end('500')
                }
                else {
                    sendMail(user.email, `Bienvenue ${user.name}`, 'Vous êtes maintenant parmi nous !')

                    res.status('200').end()
                }
            })
        }
    })
})

closeController.put('/users', (req, res) => {
    //try {
    //session = tokenHandler.verifyJWTToken(reqBodyData.token)

    const user = {
        id: session.sessionData.id,
        name: reqBodyData.user.name,
        email: session.sessionData.email,
        password: reqBodyData.user.password
    }

    dao.updateUser(user, (userUpdated) => {
        console.log(userUpdated)
        if (userUpdated == null) {
            res.status('500').end()
        }
        else {
            session = {
                sessionData: user
            }

            try {
                token = tokenHandler.createJWToken(session)

                res.json({
                    data: {
                        user: userUpdated,
                        token: token
                    }
                })
            }
            catch (error) {
                res.status('500').end()
            }
        }
    })
    // }
    // catch (error) {
    //     res.status('400').end()
    // }
})

closeController.delete('/users', (req, res) => {
    //try {
    //session = tokenHandler.verifyJWTToken(reqBodyData.token)
    dao.deleteUser(session.sessionData.id)
    res.status('200').end()
    // }
    // catch (error) {
    //     res.status('400').end()
    // }
})

//reunion close
closeController.post('/reunions', (req, res) => {
    let date = reqBodyData.reunion.date
    let jsDate = []
    for (let d of date) {
        jsDate.push(new Date(d.date))
    }

    let reunion = {}
    reunion.admin = {}
    reunion.admin.email=session.sessionData.email
    reunion.admin.name=session.sessionData.name
    reunion.title = reqBodyData.reunion.title
    reunion.place = reqBodyData.reunion.place
    reunion.note = reqBodyData.reunion.note
    reunion.date = jsDate
    const participants = reqBodyData.reunion.participants
    reunion.participant = (participants == undefined) ? {} : participants
    reunion.comment = {}
    reunion.addComment = reqBodyData.reunion.addComment
    reunion.maxParticipant = reqBodyData.reunion.maxParticipant

    dao.createReunion(reunion, (reunionAdded) => {
        //console.log("return reunion", reunionAdded)
        if (reunionAdded == undefined) {
            res.status('403').end()
        }
        else {
            try {
                let emailData = {}

                emailData.admin = reunionAdded.admin
                sendMail(reunion.admin.email, 'Votre réunion', `<p>Vous pouvez visualiser votre réunion sur votre espace personnel</p>`)
                
                for (let part of reunionAdded.participant) {
                    dao.findUserByEmail(part.email, (user) =>{ 
                        //console.log('user', user,' ',part.email)
                        if(user!=null){
                            emailData.user_participants = []
                            emailData.user_participants.push({
                                email: part.email
                            })
                            sendMailToUsers(emailData)
                        }
                        else{
                            try {
                                const participantSession = {
                                    sessionData: {
                                        name: part.name,
                                        admin: false,
                                        email: part.email,
                                        idReunion: reunionAdded._id,
                                        idParticipant: part._id
                                    }
                                }
                                const participantToken = tokenHandler.createJWToken(participantSession, true)
                                emailData.participants = []
                                emailData.participants.push({
                                    email: part.email,
                                    token: participantToken
                                })
                                sendMailToParticipants(emailData)
                            }
                            catch (error) {
                                res.status('500').end("hoho")
                            }
                        }  
                    })      
                }

                console.log('emailData', emailData)
                res.status('200').end("votre reunion a bien été créée")
            }
            catch (error) {
                console.log(error)
                res.status('404').end()
            }
        }
    })
})

closeController.get('/reunions/:reunion_id/:token', (req, res) => {
    const token = req.params.token
    try {
        // verifier si il la personne est autorisé a recupérer la reunion
        //console.log("token -> ", token) 
        const session = tokenHandler.verifyJWTToken(token)
        //console.log("session -> ", session)
        dao.findParticipantWithEmail(req.params.reunion_id, session.sessionData.email, (resFind) => {
            if (resFind.participant.length != 0) {
                dao.findReunion(req.params.reunion_id, (reunion) => {
                    //console.log("reunion ->",reunion)
                    if (reunion == null) {
                        res.status('404').end()
                    }
                    else {
                        if(reunion.admin.email==session.sessionData.email){
                            reunion.__v = null
                            res.json({
                                data: {
                                    participant: session.sessionData,
                                    reunion: reunion
                                }
                            })
                        }else{
                            res.status('401').end('The participant does not have access to this meeting')
                        }    
                    }
                })
            }
            else {
                dao.findReunion(req.params.reunion_id, (reunion) => {
                    //console.log("reunion ->",reunion)
                    if (reunion == null) {
                        res.status('404').end()
                    }
                    else {
                        reunion.__v = null
                        res.json({
                            data: {
                                participant: session.sessionData,
                                reunion: reunion
                            }
                        })
                    }
                })
            }
        })        

    }
    catch (error) {
        console.log(error)
        res.status('500').end()
    }
})

//le token de l'autentification est dans le corps
closeController.put('/reunions/:reunion_id', (req, res) => {
    try {
        let reunion = {}
        reunion.id = req.params.reunion_id
        reunion.title = reqBodyData.reunion.title
        reunion.place = reqBodyData.reunion.place
        reunion.note = reqBodyData.reunion.note
        reunion.date = reqBodyData.reunion.date
        reunion.addComment = reqBodyData.reunion.addComment
        reunion.maxParticipant = reqBodyData.reunion.maxParticipant

        dao.findReunion(req.params.reunion_id, (reunionFound) => {
            if (reunionFound == null) {
                res.status('404').end()
            }else{
                if(reunionFound.admin.email==session.sessionData.email){
                    dao.updateReunion(reunion, (reunionUpdate) => {
                        if (reunionUpdate == null) {
                            res.status('404').end()
                        }
                        else {
                            res.status('200').end()
                        }
                    })
                }else{
                    res.status('401').end('The participant is not allowed to modify the meeting')
                }    
            }    
        })
    }
    catch (error) {
        res.status('401').end("token ko")
    }
})

closeController.delete('/reunions/:reunion_id/:token', (req, res) => {
    try {
        const token = req.params.token
        const session = tokenHandler.verifyJWTToken(token)
        const idReunion = session.sessionData.idReunion

        dao.findReunion(req.params.reunion_id, (reunion) => {
            //console.log("reunion ->",reunion)
            if (reunion == null) {
                res.status('404').end()
            }
            else {
                if(reunion.admin.email==session.sessionData.email){
                    dao.deleteReunion(req.params.reunion_id, (reunionDelete) => {
                        if (reunionDelete == null) {
                            res.status('404').end()
                        }
                        else {
                            res.status('200').end()
                        }
                    })
                }else{
                    res.status('401').end('The participant is not allowed to delete the meeting')
                }    
            }
        })
    }
    catch (error) {
        console.log(error)
        res.status('400').end()
    }
})

//l'admin peut ajouter et supprimer tout le monde or le participant landa ne peut que se supprimer
closeController.post('/reunions/:id_reunion/participants', (req, res) => {
    try {
        //const reqBodyData = req.body.data
        //const token = reqBodyData.token
        //const session = tokenHandler.verifyJWTToken(token, true)

        dao.findReunion(req.params.id_reunion, (reunion) => {
            //console.log("reunion ->",reunion)
            if (reunion == null) {
                res.status('404').end()
            }
            else {
                if(reunion.admin.email==session.sessionData.email){
                    let participant = {}
                    participant.email = reqBodyData.participant.email
                    participant.name = reqBodyData.participant.name

                    dao.findParticipantWithEmail(req.params.id_reunion, participant.email, (resFind) => {
                        if (resFind.participant.length != 0) {
                            res.status('403').end('This email is already taken')
                        }
                        else {
                            dao.createParticipant(req.params.id_reunion, participant, (participantAdded) => {
                                console.log("participantAdded ->", participantAdded)
                                if (participantAdded == (undefined || null || [])) {
                                    res.status('403').end('error')
                                }
                                //res.json(participantAdded)
                                else{
                                    let emailData = {}
                                    emailData.admin={}
                                    emailData.admin.email = session.sessionData.email
                                    emailData.admin.name = session.sessionData.name

                                    dao.findUserByEmail(participant.email, (user) =>{ 
                                        console.log('user', user,' ',participant.email)
                                        if(user!=null){
                                            emailData.user_participants = []
                                            emailData.user_participants.push({
                                                email: participant.email
                                            })
                                            sendMailToUsers(emailData)
                                        }
                                        else{
                                            try {
                                                const participantSession = {
                                                    sessionData: {
                                                        name: participant.name,
                                                        admin: false,
                                                        email: participant.email,
                                                        idReunion: req.params.id_reunion,
                                                        idParticipant: participantAdded.participants[participantAdded.participants.length - 1]._id
                                                    }
                                                }
                                                const participantToken = tokenHandler.createJWToken(participantSession, true)
                                                emailData.participants = []
                                                emailData.participants.push({
                                                    email: participant.email,
                                                    token: participantToken
                                                })
                                                sendMailToParticipants(emailData)
                                            }
                                            catch (error) {
                                                res.status('500').end("hoho")
                                            }
                                        }  
                                    })
                                    res.status('200').end("Le participant a bien été ajouté a votre reunion")  
                                }
                            })
                        }
                    })
                }
            }
        }) 
    }
    catch (error) {
        res.status('401')
    }
})

closeController.put('/reunions/:id_reunion/participants/:id_participant', (req, res) => {
    // try {
    //     const reqBodyData = req.body.data
    //     const token = reqBodyData.token
    //     const session = tokenHandler.verifyJWTToken(token, true)

    //     if (session.sessionData.idReunion == req.params.id_reunion) {
    //         const idReunion = req.params.id_reunion
    //         let participant = {}
    //         participant.id = req.params.id_participant
    //         participant.email = reqBodyData.participant.email
    //         participant.name = reqBodyData.participant.name

    //         if (session.sessionData.admin) {
    //             dao.findParticipant(idReunion, participant.id, (resFind) => {
    //                 if (resFind.participant.length == 0) {
    //                     res.status('403').end()
    //                 }
    //                 else {
    //                     dao.findParticipantWithEmail(idReunion, participant.email, (resFindEmail) => {
    //                         console.log('resFindEmail.participant', resFindEmail.participant[0]._id)
    //                         if (resFindEmail.participant.length != 0) {
    //                             if (resFindEmail.participant[0]._id != participant.id) {
    //                                 res.status('403').end('This email is already taken')
    //                             }
    //                             else {
    //                                 dao.updateParticipant(participant, (resUpdate) => {
    //                                     console.log('resUpdate', resUpdate)
    //                                     if (resUpdate == {}) {
    //                                         res.status('304').end()
    //                                     }
    //                                     else {
    //                                         const session = {
    //                                             sessionData: {
    //                                                 name: participant.name,
    //                                                 admin: false,
    //                                                 email: participant.email,
    //                                                 idReunion: idReunion,
    //                                                 idParticipant: participant.id
    //                                             }
    //                                         }
    //                                         try {
    //                                             const newToken = tokenHandler.createJWToken(session, true)
    //                                             const emailData = {
    //                                                 admin: resUpdate.admin,
    //                                                 participants: [
    //                                                     {
    //                                                         email: participant.email,
    //                                                         token: newToken
    //                                                     }
    //                                                 ]
    //                                             }

    //                                             sendMailToParticipants(emailData)

    //                                             res.json({
    //                                                 data: {
    //                                                     token: newToken
    //                                                 }
    //                                             })
    //                                         }
    //                                         catch (error) {
    //                                             res.end('500')
    //                                         }
    //                                     }
    //                                 })
    //                             }
    //                         }
    //                         else {
    //                             dao.updateParticipant(participant, (resUpdate) => {
    //                                 console.log('resUpdate', resUpdate)
    //                                 if (resUpdate == {}) {
    //                                     res.status('304').end()
    //                                 }
    //                                 else {
    //                                     const session = {
    //                                         sessionData: {
    //                                             name: participant.name,
    //                                             admin: false,
    //                                             email: participant.email,
    //                                             idReunion: idReunion,
    //                                             idParticipant: participant.id
    //                                         }
    //                                     }
    //                                     try {
    //                                         const newToken = tokenHandler.createJWToken(session, true)

    //                                         const emailData = {
    //                                             admin: resUpdate.admin,
    //                                             participants: [
    //                                                 {
    //                                                     email: participant.email,
    //                                                     token: newToken
    //                                                 }
    //                                             ]
    //                                         }

    //                                         sendMailToParticipants(emailData)

    //                                         res.json({
    //                                             data: {
    //                                                 token: newToken
    //                                             }
    //                                         })
    //                                     }
    //                                     catch (error) {
    //                                         res.status('500').end()
    //                                     }
    //                                 }
    //                             })
    //                         }
    //                     })
    //                 }
    //             })
    //         }
    //         else {
    //             if (session.sessionData.idParticipant != participant.id) {
    //                 res.status('401').end()
    //             }
    //             else {
    //                 dao.findParticipantWithEmail(idReunion, participant.email, (resFindEmail) => {
    //                     if (resFindEmail.participant.length != 0) {
    //                         if (resFindEmail.participant[0]._id != participant.id) {
    //                             res.status('403').end('This email is already taken')
    //                         }
    //                         else {
    //                             dao.updateParticipant(participant, (resUpdate) => {
    //                                 if (resUpdate == {}) {
    //                                     res.status('304').end()
    //                                 }
    //                                 else {
    //                                     const session = {
    //                                         sessionData: {
    //                                             name: participant.name,
    //                                             participant: participant.email,
    //                                             idReunion: idReunion,
    //                                             idParticipant: participant.id
    //                                         }
    //                                     }
    //                                     try {
    //                                         const newToken = tokenHandler.createJWToken(session, true)

    //                                         const emailData = {
    //                                             admin: resUpdate.admin,
    //                                             participants: [
    //                                                 {
    //                                                     email: participant.email,
    //                                                     token: newToken
    //                                                 }
    //                                             ]
    //                                         }

    //                                         sendMailToParticipants(emailData)

    //                                         res.json({
    //                                             data: {
    //                                                 token: newToken
    //                                             }
    //                                         })
    //                                     }
    //                                     catch (error) {
    //                                         res.status('500').end()
    //                                     }
    //                                 }
    //                             })
    //                         }
    //                     }
    //                     else {
    //                         dao.updateParticipant(participant, (resUpdate) => {
    //                             if (resUpdate == {}) {
    //                                 res.status('304').end()
    //                             }
    //                             else {
    //                                 const session = {
    //                                     sessionData: {
    //                                         name: participant.name,
    //                                         participant: participant.email,
    //                                         idReunion: idReunion,
    //                                         idParticipant: participant.id
    //                                     }
    //                                 }
    //                                 try {
    //                                     const newToken = tokenHandler.createJWToken(session, true)

    //                                     const emailData = {
    //                                         admin: resUpdate.admin,
    //                                         participants: [
    //                                             {
    //                                                 email: participant.email,
    //                                                 token: newToken
    //                                             }
    //                                         ]
    //                                     }

    //                                     sendMailToParticipants(emailData)

    //                                     res.json({
    //                                         data: {
    //                                             token: newToken
    //                                         }
    //                                     })
    //                                 }
    //                                 catch (error) {
    //                                     res.status('500').end()
    //                                 }
    //                             }
    //                         })
    //                     }
    //                 })
    //             }
    //         }
    //     }
    //     else {
    //         res.status('401')
    //     }
    // }
    // catch (error) {
    //     res.status('401')
    // }
})

closeController.delete('/reunions/:id_reunion/participants/:id_participant', (req, res) => {
    try {
        const reqBodyData = req.body.data
        const token = reqBodyData.token
        const session = tokenHandler.verifyJWTToken(token, true)

        if (session.sessionData.idReunion == req.params.id_reunion) {
            const idReunion = req.params.id_reunion
            const idParticipant = req.params.id_participant

            if (session.sessionData.admin) {
                dao.deleteParticipant(idReunion, idParticipant, (resDelete) => {
                    console.log('resDelete', resDelete)
                    if (resDelete == null) {
                        res.status('404').end()
                    }
                    else {
                        res.status('200').end()
                    }
                })
            }
            else {
                dao.findParticipant(idReunion, idParticipant, (resFind) => {
                    if (resFind.participant.length == 0) {
                        res.status('404').end()
                    }
                    else {
                        if (resFind.participant[0]._id == session.sessionData.idParticipant) {
                            dao.deleteParticipant(idReunion, session.sessionData.idParticipant, (resDelete) => {
                                if (resDelete == null) {
                                    res.status('404').end()
                                }
                                else {
                                    res.status('200').end()
                                }
                            })
                        }
                        else {
                            res.status('401').end()
                        }
                    }
                })
            }
        }
        else {
            res.status('401').end()
        }
    }
    catch (error) {
        res.status('401').end()
    }
})

//l'admin peut ajouter et supprimer tout les commentaires mais ne peut modifier le commentaire d'un autre participant or le participant landa peut tout fais sur son commentaire
closeController.post('/reunions/:id_reunion/comments', (req, res) => {
    try {
        const reqBodyData = req.body.data
        const token = reqBodyData.token
        const session = tokenHandler.verifyJWTToken(token, true)

        const idReunion = req.params.id_reunion
        if (idReunion == session.sessionData.idReunion) {
            let comment = {}
            comment.name = session.sessionData.name
            comment.email = session.sessionData.participant
            comment.text = reqBodyData.comment.text

            dao.createComment(idReunion, comment, (resCreate) => {
                if (resCreate == {}) {
                    res.status('304').end()
                }
                else {
                    res.status('200').end()
                }
            })
        }
        else {
            res.status('401').end()
        }
    }
    catch (error) {
        res.status('401').end()
    }
})

closeController.put('/reunions/:id_reunion/comments/:id_comment', (req, res) => {
    try {
        const reqBodyData = req.body.data
        const token = reqBodyData.token
        const session = tokenHandler.verifyJWTToken(token, true)
        const idReunion = req.params.id_reunion

        if (idReunion == session.sessionData.idReunion) {
            let comment = {}
            comment.id = req.params.id_comment
            comment.name = session.sessionData.name
            comment.text = reqBodyData.comment.text
            comment.email = session.sessionData.email

            dao.findComment(idReunion, comment.id, (resFind) => {
                if (resFind.comment.length == 0) {
                    res.status('404').end()
                }
                else {
                    if (resFind.comment[0].email != comment.email) {
                        res.status('403').end()
                    }
                    else {
                        dao.updateComment(comment, (resUpdate) => {
                            if (resUpdate == {}) {
                                res.status('403').end()
                            }
                            else {
                                res.status('200').end()
                            }
                        })
                    }
                }
            })
        }
        else {
            res.status('401').end()
        }
    }
    catch (error) {
        res.status('401').end()
    }
})

closeController.delete('/reunions/:id_reunion/comments/:id_comment', (req, res) => {
    try {
        const token = req.body.data.token
        const session = tokenHandler.verifyJWTToken(token, true)

        const idReunion = req.params.id_reunion
        const idComment = req.params.id_comment

        if (session.sessionData.idReunion = idReunion) {
            dao.findComment(idReunion, idComment, (resFind) => {
                if (resFind.comment.length == 0) {
                    res.status('404').end()
                }
                else {
                    if (session.sessionData.admin) {
                        dao.deleteComment(idReunion, idComment, (resDelete) => {
                            if (resDelete == null) {
                                res.status('304').end()
                            }
                            else {
                                res.status('200').end()
                            }
                        })
                    }
                    else if (session.sessionData.email == resFind.comment[0].email) {
                        dao.deleteComment(session.sessionData.idReunion, idComment, (resDelete) => {
                            if (resDelete == null) {
                                res.status('304').end()
                            }
                            else {
                                res.status('200').end()
                            }
                        })
                    }
                    else {
                        res.status('401').end()
                    }
                }
            })
        }
        else {
            res.status('401').end()
        }
    }
    catch (error) {
        res.status('401').end()
    }
})

module.exports = closeController