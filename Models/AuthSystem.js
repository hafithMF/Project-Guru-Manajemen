const connection = require('../Config/Connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// register
async function registerAuth(name, email, password) {
  try {
    const [existingEmailAuth] = await connection.query('SELECT * FROM auth WHERE email = ?', [email]);
    if (existingEmailAuth.length > 0) throw new Error('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const [newAuth] = await connection.query(
      'INSERT INTO auth (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]
    );

    const [createdAuth] = await connection.query('SELECT * FROM auth WHERE id = ?', [newAuth.insertId]);
    return {
      success: true,
      message: 'Auth has been created',
      data: createdAuth[0]
    };
  } catch (error) {
    console.error('Error in registerAuth:', error.message);
    throw error;
  }
}

// login
async function loginAuth(email, password) {
  try {
    const [existingAuth] = await connection.query('SELECT * FROM auth WHERE email = ?', [email]);
    if (existingAuth.length === 0) throw new Error('Email does not exist');

    const Auth = existingAuth[0];
    const isPasswordValid = await bcrypt.compare(password, Auth.password);
    if (!isPasswordValid) throw new Error('Invalid email or password');

    const token = jwt.sign({ id: Auth.id }, 'teacherSecretKey', { expiresIn: '7h' });

    return {
      success: true,
      message: 'Auth has been logged in',
      Auth: {
        id: Auth.id,
        name: Auth.name,
        email: Auth.email
      },
      token
    };
  } catch (error) {
    console.error('Error in loginAuth:', error.message);
    throw new Error('Login failed');
  }
}

// get me dengan jwt
async function getMe(token) {
  try {
    const decoded = jwt.verify(token, 'teacherSecretKey');
    const [Auth] = await connection.query('SELECT * FROM auth WHERE id = ?', [decoded.id]);
    if (Auth.length === 0) throw new Error('Auth not found');

    return {
      success: true,
      message: 'Auth data fetched successfully',
      data: Auth[0]
    };
  } catch (error) {
    console.error('Error in getMe:', error.message);
    throw error;
  }
}

// logout
async function logoutAuth(token) {
  try {
    const decoded = jwt.verify(token, 'teacherSecretKey');
    jwt.sign({ id: decoded.id }, 'teacherSecretKey', { expiresIn: '0ms' });  // Invalidate token immediately

    return { success: true, message: 'Logout successful' };
  } catch (error) {
    console.error('Error in logoutAuth:', error.message);
    throw error;
  }
}

module.exports = {
    registerAuth,
    loginAuth,
    getMe,
    logoutAuth
};
