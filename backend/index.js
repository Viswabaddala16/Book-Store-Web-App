import express from 'express';
import {PORT,mongoDBURL,JWT_SECRET} from './config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bookRoute from './routes/bookRoute.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import { authenticate } from './middleware/authMiddleware.js';
import sendResetEmail from './utility/sendEmail.js';

const app = express();


// Middleware for parsing the body content 
app.use(express.json());

// express js framework is used to build the  HTTp Requests and 
// the https request methods are allows to get the response from server 
app.use(cors());
app.use('/books',authenticate,bookRoute);

app.post('/signup',async (req,res) => {
    const {email,password} = req.body;
    try{
      const existingUser  = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message :  'User already exists'})
        }
        const newUser = new User({email,password });    
        await newUser.save();
        const token = jwt.sign({id: newUser._id},JWT_SECRET,{ expiresIn : '1h'});    
        res.status(201).json({message : 'Signup is successfull',token});
    }
    catch(error){
        res.status(500).json({message : 'Error during signup ',error: error.message});
     }

});
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});
app.post('/forgot-password',async(req,res) => {
  const {email} = req.body;
  try {
    const user = await User.findOne({email});

    if(!user) return res.status(404).json({message : "User is not found"});

    const resetToken = jwt.sign({id : user._id},JWT_SECRET,{expiresIn : "15m"});

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    await sendResetEmail(email,resetLink);
    res.json({message : 'Password reset link has been sent to your email'});
  } catch(error){
    res.status(500).json({message : "Error generation passowrd reset-link",error:error.message});
  }
  
})
app.post('/reset-password',async (req,res) => {
  const{token,password} =  req.body;

  try{

    if (!token) {
      return res.status(400).json({ message: 'Token must be provided' });
    }
    const decode = jwt.verify(token,JWT_SECRET);

    const user = await User.findById(decode.id);

    if(!user) return res.status(404).json({message : "User is not found"});

    user.password = password;

    await user.save();
    res.json({message : "Password reset was successfully done"});
  } catch(error){
    res.status(400).json({message : 'Invalid or Expire token',error: error.message});

  }
})

app.get('/',(request,response) => {
    console.log(request);
    return response.status(234).send("Welcome to MERN STACK");
});

// Define __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'client','build')));

// Redirect all unknown paths to `index.html` in React's build folder
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});
mongoose
 .connect(mongoDBURL)
 .then(() => {
    console.log("App connected to database");
    app.listen(PORT,() => {
        console.log(`App isrunning on the : ${PORT}`);
    });
 })
 .catch((error) => {
    console.log(error);
 });