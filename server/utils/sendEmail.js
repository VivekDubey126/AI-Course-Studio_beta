const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, message) => {

  try{

    const transporter = nodemailer.createTransport({
      service:"gmail",
      auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from:process.env.EMAIL_USER,
      to:email,
      subject:subject,
      html:message
    });

  }catch(error){
    console.log("Email error:",error);
  }

};

module.exports = sendEmail;
