const nodemailer = require("nodemailer");


//sending mails function
async function sendMail(to , subject , html) {
   
      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.ADMIN_EMAIL , // TODO: your gmail account
          pass: process.env.ADMIN_PASSWORD, // TODO: your gmail password
        },
        tls: {
            rejectUnauthorized: false,
        },
      });
    
      let mailOptions = {
        from: process.env.ADMIN_EMAIL, // TODO: email sender
        to: to, // TODO: email receiver
        subject: subject,
        html: html,
      };
    
      let info = await transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          return console.log("Error occurs");
        }
      });
    };



//generate a Random password Function
function randomPassword(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// function getCurrentDate() {
//   var date = new Date();
//   var currentDate = date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();

//   return currentDate;
// }






module.exports = { sendMail, randomPassword  };