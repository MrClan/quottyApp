var request = require("request");
var Q = require("q");
//--------------------------------------------------------------------------------
function textMessage(message){
    return {
        "text" : message
    }
}
//--------------------------------------------------------------------------------
function reply(msg,senderId){
    //var deferred = Q.defer();
    messageData = {
        text:msg
    };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:senderId},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
    //return deferred.promise;
}
//--------------------------------------------------------------------------------
exports.textMessage = textMessage;
exports.reply = reply;