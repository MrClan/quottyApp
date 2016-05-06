var fb = require("./fb");

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


module.exports = function(req,res,next){
    console.log("===Received a message from FB");
    // Tell FB that we have received the request by ending it.
    // Without this, the request will timeout and FB will resend it
    // causing you to accidentally spam the user.
    res.end();
    console.log('===req.body', JSON.stringify(req.body));

    // Get the entries
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            console.log('searching for a random quote');
            var randomIndex = Math.floor(Math.random() * global.quotes.length);
            var quo = global.quotes[randomIndex];
            text = quo.text + '     BY: ' + quo.by;
            fb.reply(text,sender);//, "Text received, echo: " + text.substring(0, 200))
        }
        if (event.postback) {
            console.log('beta');
            text = JSON.stringify(event.postback)
            fb.reply("Postback received: "+text.substring(0, 200), sender);// token)
            continue
        }
    }
    res.sendStatus(200);
    return next();
}