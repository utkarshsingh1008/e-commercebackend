import nodemailer from "nodemailer";
import expressAsyncHandler from "express-async-handler";

// Email sending function
const sendEmail = expressAsyncHandler(async (req, res) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use TLS (secure:false for port 587)
      auth: {
        user: process.env.EMAIL_ID, // Use environment variable for the user
        pass: process.env.MP, // Use environment variable for the password
      },
    });

    // Email options
    const mailOptions = {
      from: ' "Hey"abc@gmail.com>', // sender address
      to: data.to, // list of receivers
      subject: data.subject, // Subject line
      text: data.text, // plain text body
      html: data.html, // html body
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    res.status(200).json({ message: "Email sent successfully!", info });
  } catch (error) {
    console.error("Error sending email:", error);
    
  }
});

export { sendEmail };
