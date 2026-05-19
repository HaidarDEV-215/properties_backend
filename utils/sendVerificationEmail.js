const nodemailer = require('nodemailer');

module.exports = (userEmail,code)=>{
    const transporter = nodemailer.createTransport({
        //service:'gmail',
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
        html:`
        <div style="font-family:Segoe UI, sans-serif; background:#eef2ff; padding:25px;">
            <div style="max-width:400px; margin:auto; background:white; border-radius:16px; padding:30px; box-shadow:0 10px 25px rgba(0,0,0,0.08);">

                <div style="text-align:center;">
                    <h3 style="margin-bottom:5px;">Nestify</h3>
                    <p style="color:#666; font-size:13px;">Verification Code</p>
                </div>

                <div style="margin:25px 0; text-align:center;">
                    <div style="
                        display:inline-block;
                        padding:14px 25px;
                        font-size:26px;
                        letter-spacing:6px;
                        font-weight:600;
                        border:2px dashed #6366f1;
                        border-radius:10px;
                        color:#111;">
                        ${code}
                    </div>
                </div>

                <p style="text-align:center; font-size:12px; color:#888;">
                    This code expires in 5 minutes
                </p>
                <p style="text-align:center; font-size:12px; color:#888;">
                    Do not share this code with anyone
                </p>
            </div>
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