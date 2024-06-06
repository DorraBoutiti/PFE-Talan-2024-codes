import jwt from "jsonwebtoken";
import express from "express";
import Users from "../models/users.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const router = express.Router();

// In-memory token blacklist (not suitable for production use)
let tokenBlacklist = [];
// Create a new user
router.post("/create", async (req, res) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10); 
    const oldUser = await Users.findOne({ email:req.body.email  });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    // Create a new user object with the hashed password
    const newUser = new Users({
      
      password: hashedPassword,
      dep: req.body.dep,
      pos: req.body.pos,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
    });    
    await newUser.save();
    res.status(201).send(newUser);
  } catch (err) {
    console.log(err)
    res.status(400).send(err);
  }
});

// Get all users
router.get("/getall", async (req, res) => {
  try {
    const users = await Users.find();
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get a user by ID
router.get("/get/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a user by ID
router.patch("/update/:id", async (req, res) => {
  try {
    const user = await Users.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return res.status(403).send("Token not provided");
  jwt.verify(token, secretKey , (err, decoded) => {
    if (err) return res.status(401).send("Unauthorized");
    req.userId = decoded._id;
    next();
  });
};


// Endpoint to reset password
router.post("/reset-password", verifyToken, async (req, res) => {
  try {
    const passwordSchema = Joi.object({
      password: passwordComplexity().required().label("Password"),
    });
    const { error } = passwordSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const user = await Users.findById(req.userId);
    if (!user) return res.status(404).send({ message: "User not found" });

    const salt = await bcrypt.genSalt(10); // Use a fixed salt value for simplicity
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashPassword;

    await user.save();
    res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get the logged-in user's info
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await Users.findById(req.userId).select('-password');
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Update the logged-in user's info
router.patch('/profile', verifyToken, async (req, res) => {
  try {
    const updates = req.body;
    const user = await Users.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password');
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
/*
// Get the logged-in user's info
router.get('/profile', async (req, res) => {
  try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, secretKey);
      const user = await Users.findById(decoded._id).select('-password'); // Exclude the password field
      if (!user) {
          return res.status(404).send("User not found");
      }
      res.send(user);
  } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
  }
});

// Update the logged-in user's info
router.patch('/profile', async (req, res) => {
  try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, secretKey);
      const updates = req.body;
      const user = await Users.findByIdAndUpdate(decoded._id, updates, {
          new: true,
          runValidators: true,
      }).select('-password'); // Exclude the password field
      if (!user) {
          return res.status(404).send("User not found");
      }
      res.send(user);
  } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
  }
});
*/

// Delete a user by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

/* login account with async */
const generateSecretKey = () => {  
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
let secretKey = generateSecretKey();
const updateSecretKey = () => {
  // Update secret key every 7 days
  setInterval(() => {
      secretKey = generateSecretKey();
  }, 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
  // Initial update
  secretKey = generateSecretKey();
};
// Call the function to start updating the secret key
updateSecretKey();

/* login account with async */
router.post('/login', async (req, res) => {
  try {
    const data = req.body;
    const user = await Users.findOne({ email: data.email });

    if (!user) {
      return res.status(404).send({ message: "Email not found" });
    }

    const validPass = await bcrypt.compare(data.password, user.password);
    if (!validPass) {
      return res.status(401).send({ message: "Invalid password" });
    }

    const payload = {
      _id: user._id,
      email: user.email,
      firstname: user.firstname
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: '6000m' });
    res.status(200).send({ myToken: token, mysecretkey: secretKey });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


router.post("/register", async (req, res) => {
  const data = req.body;
  const encryptedPassword = await bcrypt.hash(data.password, 10);
  try {
    const oldUser = await User.findOne({ email:data.email  });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    await User.create({
      
      password: encryptedPassword,
      dep: req.body.dep,
      pos: req.body.pos,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});


// Logout route
router.post('/logout', (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  tokenBlacklist.push(token); // Add token to blacklist
  res.status(200).send({ message: 'Logout successful' });
});

// Middleware to check for blacklisted tokens
const checkBlacklist = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (tokenBlacklist.includes(token)) {
    return res.status(401).send('Token is blacklisted. Please login again.');
  }
  next();
};

// Apply the middleware
router.use(checkBlacklist);



export default router;