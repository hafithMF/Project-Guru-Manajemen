const connection = require('../Config/Connection')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// register

async function registerAuth(name, email, password) {
  try {
    // Mengecek apakah email ini sudah terdaftar / belum?
    const [existingEmailAuth] = await connection.query('select * from user where email =?', [email]);
      if (existingEmailAuth.length > 0) throw new Error('Email already exists');
      
    // Mengecek apakah password yang dimasukkan benar?
      const hashedPassword = await bcrypt.hash(password, 10);
      
    // kalau tidak ada maka kita boleh buat email tersebut.
    const [newAuth] = await connection.query(
      'insert into user (name, email, password) values (?, ? , ? , ?)', [name, email, hashedPassword]);

    const [createdAuth] = await connection.query('SELECT * FROM user WHERE id = ?', [newAuth.insertId]);

    return {
      success: true,
      message: 'Auth has been created',
      data: createdAuth[0]
    }
  }
  catch (error) {
    throw new Error(error);
  }
}

// login
async function loginAuth(email, password) {
  try {
    // Mengecek apakah email ini sudah terdaftar atau belum
    const [existingEmailAuth] = await connection.query('SELECT * FROM user WHERE email = ?', [email]);
    if (existingEmailAuth.length === 0) {
      throw new Error('Email does not exist');
    }

    const Auth = existingEmailAuth[0];

    // Meriksa apakah password yang dimasukkan benar
    const isPasswordValid = await bcrypt.compare(password, Auth.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Jika email dan password cocok, buat token JWT
    const token = jwt.sign({ id: Auth.id }, 'teacherSecretKey', {
      expiresIn: '7h'
    });

    return {
      success: true,
      message: 'User has been logged in',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    };
  } catch (error) {
    console.error(error);
    throw new Error('Login failed');
  }
}

// get me dengan jwt

async function getMe(token) {
  try {
    const decoded = jwt.verify(token, 'teacherSecretKey');
    const [checkAuth] = await connection.query('select * from user where id =?', [decoded.id]);

    const Auth = checkAuth[0];
    return {
      success: true,
      message: 'User data fetched successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }
  }
  catch (error) {
    throw new Error(error);
  }
}

// logout
async function logoutAuth(token) {
  try {
    const decoded = jwt.verify(token, 'teacherSecretKey');
    jwt.sign({ id: decoded.id }, 'teacherSecretKey', {
      expiresIn: '7d'
    });

    return { success: true, message: 'Logout successful' };

  }
  catch (error) {
    throw new Error(error);
  }
}

module.exports = {
    registerAuth,
    loginAuth,
    getMe,
    logoutAuth
}