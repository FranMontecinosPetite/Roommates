const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "franmontecinos.p@gmail.com",
    pass: "nfoiuttqxjsuiwwk",
  },
});

const sendMail =  (user) => {
  let mailOptions = {
    from: "franmontecinos.p@gmail.com",
    to: "franmontecinos.p@gmail.com",
    subject: `Hicieron un gasto`,
    html: `<h2>¡${user} ha hecho un gasto!</h2>`,
  };

  transporter.sendMail(mailOptions, (err, data)=>{
    if (err) console.log(err);
    if (data) console.log("Mensaje enviado con éxito!")
  });
};


module.exports = sendMail;