const { model } = require('mongoose');
const nodemailer = require('nodemailer')

const cancelEmail = async options =>{
  const transport={
         
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_POST,
        auth:{
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASS                       
        }                           
  };

  const transporter = nodemailer.createTransport(transport)

  const message = {
      from:options.email,
      to:process.env.SMTP_FROM_EMAIL,
      subject:options.subject,
      text:options.message                             
  }

 await transporter.sendMail(message)
}

module.exports = cancelEmail;