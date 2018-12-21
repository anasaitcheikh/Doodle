var nodemailer = require('nodemailer')

isJSON = function(data){
    try{
        JSON.parse(data)
        return true
    }
    catch(e){
        return false
    }
}

requestErrorMsg = {
    jsonMalformed: "Malformed Request's JSON",
    reunionNotFound: 'Reunion not found',
    participantNotFound: 'Participant not found',
    commentNotFound: 'Comment not found',
    internalError: 'Internal Error'
}

responseStatus = {
    error: 'error',
    fail: 'fail',
    succes: 'succes'
}

function sendMail(emailDest, subject, text){
    const user = 'middleware.project.2018@gmail.com'
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: user,
            pass: 'azertyuiop789@'
        }
    })
    var mailOptions = {
        from: `${user}`,
        to: `${emailDest}`,
        subject: `${subject}`,
        text: `${text}`
    }
    transporter.sendMail(mailOptions, function(error, info){
        if (error) { console.log(error) }
        else { console.log('Email sent: ' + info.response) }
        transporter.close();
    }) 
}

//sendMail('ademou@gmail.com', 'ouverture de la reunion', 'nouvelle reunion ouverte')


module.exports = {
    isJson: isJSON,
    requestErrorMsg: requestErrorMsg,
    responseStatus: responseStatus,
    sendMail : sendMail
}