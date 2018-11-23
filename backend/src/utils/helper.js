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

module.exports = {
    isJson: isJSON,
    requestErrorMsg: requestErrorMsg,
    responseStatus: responseStatus
}