const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");


// REGISTER
exports.registerUser = async (req,res)=>{

  const {name,email,password} = req.body;

  try{

    const userExists = await User.findOne({email});

    if(userExists){
      return res.status(400).json({message:"User already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password:hashedPassword,
      verificationToken
    });

    const verifyLink =
    `${process.env.CLIENT_URL}/verify/${verificationToken}`;

    await sendEmail(
      email,
      "Verify your email",
      `
      <h2>Email Verification</h2>
      <p>Click below to verify your account</p>
      <a href="${verifyLink}">Verify Email</a>
      `
    );

    res.json({
      message:"Registration successful. Check email to verify."
    });

  }catch(error){
    res.status(500).json({message:error.message});
  }

};


// VERIFY EMAIL
exports.verifyEmail = async (req,res)=>{

  try{

    const token = req.params.token;

    const user = await User.findOne({
      verificationToken:token
    });

    if(!user){
      return res.status(400).json({message:"Invalid token"});
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    res.json({
      message:"Email verified successfully"
    });

  }catch(error){
    res.status(500).json({message:error.message});
  }

};


// LOGIN
exports.loginUser = async (req,res)=>{

  const {email,password} = req.body;

  try{

    const user = await User.findOne({email});

    if(!user){
      return res.status(400).json({message:"Invalid credentials"});
    }

    if(!user.isVerified){
      return res.status(401).json({
        message:"Please verify email first"
      });
    }

    const match = await bcrypt.compare(password,user.password);

    if(!match){
      return res.status(400).json({message:"Invalid credentials"});
    }

    res.json({
      token:generateToken(user._id,user.name),
      name:user.name
    });

  }catch(error){
    res.status(500).json({message:error.message});
  }

};


// FORGOT PASSWORD
exports.forgotPassword = async (req,res)=>{

  const {email} = req.body;

  try{

    const user = await User.findOne({email});

    if(!user){
      return res.status(404).json({
        message:"User not found"
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetLink =
    `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail(
      email,
      "Password Reset",
      `
      <h2>Reset Password</h2>
      <p>Click below to reset your password</p>
      <a href="${resetLink}">Reset Password</a>
      `
    );

    res.json({
      message:"Password reset link sent to email"
    });

  }catch(error){
    res.status(500).json({message:error.message});
  }

};


// RESET PASSWORD
exports.resetPassword = async (req,res)=>{

  const {password} = req.body;
  const token = req.params.token;

  try{

    const user = await User.findOne({
      resetPasswordToken:token,
      resetPasswordExpire:{$gt:Date.now()}
    });

    if(!user){
      return res.status(400).json({
        message:"Invalid or expired token"
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password,salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message:"Password reset successful"
    });

  }catch(error){
    res.status(500).json({message:error.message});
  }

};
