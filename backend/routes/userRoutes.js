const router = require('express').Router();
const  User  = require('../models/user');
const { signToken } = require('../util/auth');
const passport = require("../util/passport")

router.get("/", async (req,res) => {
  try {
    const users = await User.find()
    res.json(users);
  } catch (err) {
 res.status(400).json({
  error: err.message
})
  }
})

// POST /api/users/register - Create a new user
router.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
   res.status(400).json({
  error: err.message
});
  }
});
 
// POST /api/users/login - Authenticate a user and return a token
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
 
  if (!user) {
    return res.status(400).json({ message: "Can't find this user" });
  }
 
  const correctPw = await user.isCorrectPassword(req.body.password);
 
  if (!correctPw) {
    return res.status(400).json({ message: 'Wrong password!' });
  }
 
  const token = signToken(user);
  res.json({ token, user });
});
 
// Route to start the OAuth flow
// When a user visits this URL, they will be redirected to GitHub to log in.
router.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }) // Request email scope
);
 
// The callback route that GitHub will redirect to after the user approves.
router.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login', // Where to redirect if user denies
    session: false // We are using tokens, not sessions
  }),
  (req, res) => {
    // At this point, `req.user` is the user profile returned from the verify callback.
    // We can now issue our own JWT to the user.
    const token = signToken(req.user);
    // Redirect the user to the frontend with the token, or send it in the response
     res.redirect(
      `http://localhost:5173/oauth-success?token=${token}`
    );
  }
);

module.exports = router;