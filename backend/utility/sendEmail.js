import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendResetEmail = async (email,resetLink) =>{
    const transporter = nodemailer.createTransport({
        service :  'Gmail',
        auth : {
            user : process.env.Email_User,
            pass : process.env.Email_Pass,
        }
    });
    const mailOptions = {
        from : process.env.Email_User,
        to : email,
        subject : 'Passowrd Reset',
        text : `Click on the following link to reset your password : ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
}
export default sendResetEmail;