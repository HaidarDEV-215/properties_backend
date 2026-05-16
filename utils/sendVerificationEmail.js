const nodemailer = require('nodemailer');

module.exports = (userEmail,code)=>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.APP_EMAIL,
            pass:process.env.APP_PASSWORD 
        },
        host:'smtp.gmail.com', // to work with render and all cloud services
        port:587,
        secure:false
    });

    const mailOptions = {
        from:process.env.APP_EMAIL,
        to:userEmail,
        subject:'Verify Your Email',
        html:`<div>
                <h4>Nestify verification code:</h4>
                <p>${code}</P>
            </div>`
    };

    transporter.sendMail(mailOptions,(error,success)=>{
        if(error){
            console.error(error);        
        }else{
            console.log("email sent : ",success.responce);        
        }
    });
}