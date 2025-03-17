import express from 'express';
import session from 'express-session';
import csrf from 'csrf';
import path from 'path';
import { authenticate } from './middleware/authMiddleware.js';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongodb-session';
import Stripe from 'stripe';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PORT, mongoDBURL, JWT_SECRET, SESSION_SECRET } from './config.js';
import bookRoute from './routes/bookRoute.js';
import User from './models/User.js';
import sendResetEmail from './utility/sendEmail.js';

const app = express();
const stripe = new Stripe("sk_test_51QkPsQFNPDaRgMWYPF2UDZvX4cP8tTG5YQINMey5iIdFUCteCCKExs3cr01OlHQXAueoJp4PgARtE7fi0WBJ2ioa0088G543Ns");

const allowedOrigins = ['http://localhost:5173']; 

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ✅ MongoDB Session Storage Setup
const MongoDBStore = MongoStore(session);
const store = new MongoDBStore({
  uri: mongoDBURL,
  collection: "sessions",
});

// ✅ Secure Session Setup
app.use(session({
  secret: SESSION_SECRET || 'my-secret',
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    secure: false,  // Change to true for production (HTTPS)
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    sameSite: 'lax', // Fix for CSRF
  },
}));
app.use('/books',authenticate,bookRoute);
const tokens = new csrf();

// ✅ CSRF Token Generation & Verification
app.get("/api/get-csrf-token", (req, res) => {
  const secret = tokens.secretSync();
  req.session.csrfSecret = secret;
  const csrfToken = tokens.create(secret);
  res.json({ csrfToken });
});

// ✅ Session Check API
app.get("/api/check-session", (req, res) => {
  if (req.session && req.session.user) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// ✅ Payment Intent API with CSRF Protection
app.post("/api/create-payment-intent", async (req, res) => {
  console.log("Session CSRF Secret:", req.session.csrfSecret); // Debugging
  const { amount, csrfToken } = req.body;

  if (!req.session.csrfSecret) {
    return res.status(403).json({ message: "CSRF Token Missing (Session expired)" });
  }
  
  if (!tokens.verify(req.session.csrfSecret, csrfToken)) {
    return res.status(403).json({ message: "CSRF Token Mismatch" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ User Authentication APIs
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    req.session.user = { id: newUser._id, email: newUser.email };
    
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'Signup successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Signup error', error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    req.session.user = { id: user._id, email: user.email };
    
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
});

// ✅ Forgot & Reset Password
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
    
    await sendResetEmail(email, resetLink);
    res.json({ message: 'Password reset link sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reset link', error: error.message });
  }
});

app.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token', error: error.message });
  }
});

const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

// ✅ Connect to MongoDB & Start Server
mongoose.connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => console.error('DB Connection Error:', error));



// import express from 'express';
// import session from 'express-session';
// import csrf from 'csrf';
// import {PORT,mongoDBURL,JWT_SECRET,SESSION_SECRET} from './config.js';
// import path from 'path';
// import Stripe from 'stripe';
// import { fileURLToPath } from 'url';
// import mongoose from 'mongoose';
// import MongoStore from 'connect-mongodb-session';
// import bookRoute from './routes/bookRoute.js';
// import cors from 'cors';
// import jwt from 'jsonwebtoken'; 
// import User from './models/User.js';
// import { authenticate } from './middleware/authMiddleware.js';
// import sendResetEmail from './utility/sendEmail.js';


//   const app = express();
  
  
//   // Initialize Stripe with your secret key
//   const stripe = new Stripe("sk_test_51QkPsQFNPDaRgMWYPF2UDZvX4cP8tTG5YQINMey5iIdFUCteCCKExs3cr01OlHQXAueoJp4PgARtE7fi0WBJ2ioa0088G543Ns");

  
//   // Middleware for parsing the body content 
//   app.use(express.json());

//   // express js framework is used to build the  HTTp Requests and 
//   // the https request methods are allows to get the response from server 
//   const allowedOrigins = ['http://localhost:5173']; // 👈 Add your frontend URL here

// // ✅ CORS Configuration
// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true, // 👈 Allow credentials (cookies, sessions)
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );

// // ✅ Add middleware to allow pre-flight requests
// app.options('*', cors());
// ;

//   app.use('/books',authenticate,bookRoute);
//   const tokens = new csrf();

//   const MongoDBStore = MongoStore(session);
//   const store = new MongoDBStore({
//     uri: mongoDBURL, // Use your MongoDB connection string
//     collection: "sessions",
//   });

//   app.use(session({
//     secret: SESSION_SECRET || 'my-secret',
//     resave: false,
//     saveUninitialized: false,
//     store: store,
//     proxy: true,
//     cookie: {
//       secure: true, // true if HTTPS
//       httpOnly: true,
//       maxAge: 60 * 60 * 1000, // 1 hour
//       sameSite: 'none' // Ensure cookies work cross-origin
//     }
//   }));
  
//   app.get("/api/get-token", (req, res) => {
//     try {
//       const token = tokens.create(SESSION_SECRET);
//       res.json({ token });
//     } catch (error) {
//       res.status(500).json({ error: "Failed to generate token" });
//     }
//   });    


//   // ✅ Session Check API
//   app.get("/api/check-session", (req, res) => {
//     if (req.session && req.session.user) {
//       res.json({ sessionActive: true });
//     } else {
//       res.status(401).json({ sessionActive: false });
//     }
//   });
  

// app.get("/api/get-csrf-token", (req, res) => {
//   const secret = tokens.secretSync();
//   req.session.csrfSecret = secret;
//   const csrfToken = tokens.create(secret);
//   res.json({ csrfToken });
// });



// // ✅ Payment Intent API
// app.post("/api/create-payment-intent", async (req, res) => {
//   const { amount, csrfToken } = req.body;

//   if (!req.session.csrfSecret) {
//     return res.status(403).json({ message: "CSRF Token Missing (Session might be expired)" });
//   }

//   if (!tokens.verify(req.session.csrfSecret, csrfToken)) {
//     return res.status(403).json({ message: "CSRF Token Mismatch" });
//   }

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "usd",
//     });

//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


//   // Define __filename and __dirname for ES modules
//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);


//   // Middleware for serving static files
//   app.use('/uploads', express.static('uploads'));
//   app.post('/signup',async (req,res) => {
//   const {email,password} = req.body;
//   try{
//     const existingUser  = await User.findOne({email});
//       if(existingUser){
//           return res.status(400).json({message :  'User already exists'})
//       }
//       const newUser = new User({email,password });    
//       await newUser.save();
//       const token = jwt.sign({id: newUser._id},JWT_SECRET,{ expiresIn : '1h'});    
//       res.status(201).json({message : 'Signup is successfull',token});
//   }
//   catch(error){
//       res.status(500).json({message : 'Error during signup ',error: error.message});
//     }

//   });
//   app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ message: 'User not found' });

//   const isMatch = await user.comparePassword(password);
//   if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//   // Store session
//   req.session.user = {
//     id: user._id,
//     email: user.email
//   };

//   const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
//   console.log("Generated Token:", token);
//   res.json({ message: 'Login successful', token });
//   } catch (error) {
//   res.status(500).json({ message: 'Error during login', error: error.message });
//   }
//   });
//   app.post('/forgot-password',async(req,res) => {
//   const {email} = req.body;
//   try {
//   const user = await User.findOne({email});

//   if(!user) return res.status(404).json({message : "User is not found"});

//   const resetToken = jwt.sign({id : user._id},JWT_SECRET,{expiresIn : "15m"});

//   const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

//   await sendResetEmail(email,resetLink);
//   res.json({message : 'Password reset link has been sent to your email'});
//   } catch(error){
//   res.status(500).json({message : "Error generation passowrd reset-link",error:error.message});
//   }

//   })
//   app.post('/reset-password',async (req,res) => {
//   const{token,password} =  req.body;

//   try{

//   if (!token) {
//     return res.status(400).json({ message: 'Token must be provided' });
//   }
//   const decode = jwt.verify(token,JWT_SECRET);

//   const user = await User.findById(decode.id);

//   if(!user) return res.status(404).json({message : "User is not found"});

//   user.password = password;

//   await user.save();
//   res.json({message : "Password reset was successfully done"});
//   } catch(error){
//   res.status(400).json({message : 'Invalid or Expire token',error: error.message});

//   }
//   })

//   app.get('/',(request,response) => {
//   console.log(request);
//   return response.status(234).send("Welcome to MERN STACK");
//   });



//   app.use(express.static(path.join(__dirname, 'client','build')));

//   // Redirect all unknown paths to index.html in React's build folder
//   app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
//   mongoose.connect(mongoDBURL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
//   })
//   .then(() => {
//   console.log("App connected to database");
//   app.listen(PORT, () => {
//     console.log("App is running on port:", `${PORT}`);
//   });
//   })
//   .catch((error) => {
//   console.log('Error connecting to MongoDB:', error.message);
//   });