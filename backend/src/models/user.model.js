import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    fullName:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    profilePic:{
        type:String,
        default:""
    },
},
{timestamps:true}
);

userSchema.pre('save',async function(next){
    try {
        const user = this;
        if(!user.isModified('password')){
            return next;
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.password,salt);
        user.password = hashPassword;
        next();
    } catch (error) {
        return next(err);
    }
})

userSchema.methods.comparePassword = async function(password){
    try {
        const isMatch = await bcrypt.compare(password,this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
}



const chatUser = mongoose.model('chatUser',userSchema);

export default chatUser;