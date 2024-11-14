import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
});

// function to hash thhe password before save teh user

userSchema.pre('save',async function(next)  {
    if(!this.isModified('password')) return next();  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next(); 
})

//  Add a method to compare password

userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword,this.password);
};

export default mongoose.model("User",userSchema);
