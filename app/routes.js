const mongoose = require('mongoose');
const User = mongoose.model('User');
const Student = require('./models/students')

// const student = mongoose.model('student', new mongoose.Schema({
//   name: String,
//   msg: String,
// }));

module.exports = function (app, passport) {

  // Home page
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // Profile page
  app.get('/profile', isLoggedIn, async (req, res) => {
    try {
      const students = await Student.find();
      res.render('profile.ejs', { user: req.user, Student: students });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error loading profile');
    }
  });
  app.post('/student', async (req, res) => {
    console.log(req.body)
    try {
      await Student.create({
        name: req.body.name,
        subject: req.body.subject,
        midterm: req.body.midterm,
        final: req.body.final,
        average: req.body.average
      });

      res.redirect('/profile');
    }
    catch (err) {
      console.error(err);
      res.status(500).send('Error saving message');
    }
})
  // Logout
  app.get('/logout', function (req, res) {
    req.logout(() => {
      console.log('User has logged out!');
    });
    res.redirect('/');
  });

  // // Message routes
  // app.post('/messages', async (req, res) => {
  //   try {
  //     await Message.create({
  //       name: req.body.name,
  //       msg: req.body.msg,
  //       thumbUp: 0,
  //       thumbDown: 0
  //     });
  //     console.log('Message saved to database');
  //     res.redirect('/profile');
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).send('Error saving message');
  //   }
  // });

  // app.put('/messages', async (req, res) => {
  //   try {
  //     const result = await Message.findOneAndUpdate(
  //       { name: req.body.name, msg: req.body.msg },
  //       { $inc: { thumbUp: 1 } },
  //       { new: true }
  //     );
  //     res.json(result);
  //   } catch (err) {
  //     res.status(500).send(err);
  //   }
  // });

  // app.put('/messagesDown', async (req, res) => {
  //   try {
  //     const result = await Message.findOneAndUpdate(
  //       { name: req.body.name, msg: req.body.msg },
  //       { $inc: { thumbUp: -1 } },
  //       { new: true }
  //     );
  //     res.json(result);
  //   } catch (err) {
  //     res.status(500).send(err);
  //   }
  // });

  // app.delete('/messages', async (req, res) => {
  //   try {
  //     await Message.findOneAndDelete({ 
  //       name: req.body.name, 
  //       msg: req.body.msg 
  //     });
  //     res.send('Message deleted!');
  //   } catch (err) {
  //     res.status(500).send(err);
  //   }
  // });

  // Login routes
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // Signup routes
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // Unlink local account
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}