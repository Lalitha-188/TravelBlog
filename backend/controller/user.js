const User=require("../models/user")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")


const userSignUp = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Email and Password is required" });
  }

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const hashPwd = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    email,
    password: hashPwd,
  });

const token = jwt.sign(
  { _id: newUser._id, email: newUser.email }, // 👈 use _id
  process.env.SECRET_KEY,
  { expiresIn: "1h" }
);


  // ✅ Return clean user object only
  return res.status(200).json({
    token,
    user: {
      _id: newUser._id,
      email: newUser.email,
    },
  });
};
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and Password is required" });
    }

    const user = await User.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        token,
        user: {
          _id: user._id,
          email: user.email
        }
      });
    } else {
      return res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


const getUser=async(req,res)=>{
 try {
    const id = req.params.id;

    // Validate ID format (MongoDB ObjectId is 24 hex characters)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: "Invalid user ID format" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Return only email (no password)
    res.status(200).json({ email: user.email });
  } catch (error) {
    console.error("getUser error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports={userLogin,userSignUp,getUser}






