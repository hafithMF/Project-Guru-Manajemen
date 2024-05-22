const { registerAuth, loginAuth, logoutAuth, getMe } = require('../Models/AuthSystem');
const { body, validationResult } = require('express-validator');

// register
async function register(req, res) {
  const validation = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().isEmail().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required")
  ];
  await Promise.all(validation.map((v) => v.run(req)));
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errMsg = errors.array().map(error => ({
      [error.path]: error.msg
    }));
    return res.status(422).json({
      status: false,
      message: 'Validation error',
      error: errMsg
    });
  }
  const { name, email, password } = req.body;
  try {
    const result = await registerAuth(name, email, password);
    if (result.success) {
      res.status(201).json({
        success: result.success,
        message: result.message,
        data: {
          id: result.data.insertId,
          name: result.data.name,
          email: result.data.email
        }
      });
    } else {
      res.status(500).json({ error: result.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// login
async function login(req, res) {
  const validation = [
    body("email").notEmpty().isEmail().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required")
  ];
  await Promise.all(validation.map((v) => v.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errMsg = errors.array().map(error => ({
      [error.path]: error.msg
    }));
    return res.status(422).json({
      success: false,
      message: 'Validation error',
      errors: errMsg
    });
  }

  const { email, password } = req.body;
  try {
    const result = await loginAuth(email, password);
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        Auth: result.auth,
        token: result.token
      });
    } else {
      res.status(401).json({ success: false, error: result.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}


// get Me 
async function me(req, res) {
  try {
    const token = req.headers.authorization;
    const auth = await getMe(token);
    if (!auth) {
      return res.status(404).json({ error: true, message: 'Auth not found' });
    }
    if (auth.success) {
      res.status(200).json({
        success: auth.success, message: auth.message, data: auth.data
      })
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Failed to fetch auth data' });
  }
}

// logout 
async function logout(req, res) {
  try {
    const token = req.headers.authorization;
    const result = await logoutAuth(token);
    if (!result) {
      return res.status(404).json({ error: true, message: 'Auth not found' });
    }

    if (result.success) {
      res.status(201).json({
        success: result.success,
        message: result.message,
      })
    } else {
      res.status(500).json({ error: result.message })
    }
  }
  catch (error) {
    console.error(error);
  }
}

module.exports = {
    register,
    login,
    me,
    logout
}