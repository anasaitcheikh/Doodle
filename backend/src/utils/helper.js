var nodemailer = require('nodemailer')

isJSON = function (data) {
    try {
        JSON.parse(data)
        return true
    }
    catch (e) {
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

function sendMail(emailDest, subject, text) {
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
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) { console.log(error) }
        else { console.log('Email sent: ' + info.response) }
        transporter.close();
    })
}

//sendMail('ademou@gmail.com', 'ouverture de la reunion', 'nouvelle reunion ouverte')

function sendMailToParticipants(emailData) {
    const suject = "Ajout à une nouvelle réunion"
    const admin = emailData.admin
    for (let participant of emailData.participants) {
        const baseLink = "http://localhost:8080/api/open/reunions"
        const token = participant.token
        const text = `<html><h1>${admin.name} (${admin.email}) Vous a ajouté dans une nouvelle réunion</h1>
        <br>
        <p>Vous pouvez cliquer sur ce lien <a href="${baseLink}/${token}">lien</a></p>
        <br>
        <br>
        <p>Cordialement.</p>
        </html>`
        sendMail(participant.email, suject, text)
    }
}


module.exports = {
    isJson: isJSON,
    requestErrorMsg: requestErrorMsg,
    responseStatus: responseStatus,
    sendMail: sendMail,
    sendMailToParticipants: sendMailToParticipants
}