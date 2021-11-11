const nodemailer = require("nodemailer");


//sending mails function
async function sendMail(to , subject , html) {
   
      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.ADMIN_EMAIL , // TODO: your gmail account
          pass: process.env.ADMIN_PASSWORD, // TODO: your gmail password
        },
        // tls: {
        //     rejectUnauthorized: false,
        // },
      });

      await new Promise((resolve, reject) => {
        // verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log("Server is ready to take our messages");
                resolve(success);
            }
        });
      });
    
      let mailOptions = {
        from: process.env.Email_FROM, // TODO: email sender
        to: to, // TODO: email receiver
        subject: subject,
        html: html,
      };
    
      await new Promise((resolve, reject) => {
        // send mail
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(info);
                resolve(info);
            }
        });
      });

      // let info = await  new Promise((resolve, reject) => {
      //   transporter.sendMail(mailOptions, (err, data) => {
      //     if (err) {
      //       return console.log("Error occurs");
      //     }else{
      //       return console.log("mail sent successfully")
      //     }
      //   });
      // })
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