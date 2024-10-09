const AWS = require('aws-sdk');

const ses = new AWS.SES();

exports.handler = async (event) =>{
    const {to, from, subject, text} = JSON.parse(event.body);
    if(!to || !from || !subject || !text)
    {
        return _400({message: 'Missing paramater on request body'});
    }

    const emailParams = {
        Destination:{
            ToAddresses: [to]
        },
        Message:{
            Body:{
                Text:{Data: text}
            },
            Subject:{Data: subject}
        },
        Source: from
    }

    try{
        await ses.sendEmail(emailParams).promise();
        return _200();
    } catch(error){
        console.log('Error sending email', error);
        return _400({message: 'Unable to send the email'});
    }
};

const _400 = body =>{
    return{
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods' : '*',
            'Access-Control-Allow-Origin' : '*',
        },
        statusCode: 400,
        body: JSON.stringify(body)
    };
};

const _200 = () =>{
    return{
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods' : '*',
            'Access-Control-Allow-Origin' : '*',
        },
        statusCode: 200,
        body: ''
    };
};