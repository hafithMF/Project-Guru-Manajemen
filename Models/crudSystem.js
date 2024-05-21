const connection = require('../Config/Connection');
const { body, validationResult } = require('express-validator');
const runValidation = require('../Config/Validation');

async function listCrud(authId) {
  try {
    const [crud] = await connection.query('select * from todos where user_id = ?', [authId]);
    return { status: true, message: 'success get todos', data: crud };
  } catch (error) {
    console.log(error);
  }
}
async function createCrud(name, alamat, pelajaran, authId) {
  // cek validasi
  const validation = [
    body("name").notEmpty().withMessage("name is required"),
    body("alamat").notEmpty().withMessage("Description is required"),
    body("pelajaran").notEmpty().withMessage("pelajaran is required"),
  ];

  const validationErrors = await runValidation(validation, { name, alamat, pelajaran });
  if (validationErrors) {
    return { status: false, message: 'Validation errors', error: validationErrors };
  }

  try {
    const [newCrud] = await connection.query('insert into todos (name, alamat, pelajaran, user_id) values (?,?,?)', [name, alamat, pelajaran, userId]);
    return {
      status: true, message: 'Todo has been created', data: {
        id: newCrud.insertId,
        name, alamat, pelajaran, authId
      }
    }
  } catch (error) {
    console.error(error);
  }
}
async function showCrud(crudId, authId) {

  try {
    const [crud] = await connection.query('select * from todos where id =? and auth_id =?', [crudId, authId]);
    return {
      status: true,
      message: 'success get crud',
      data: crud
    }
  } catch (error) {
    console.log(error);
  }
}
async function updateCrud(crudId, name, alamat, pelajaran, authId) {
  // mencek validasi
  const validation = [
    body("name").notEmpty().withMessage("Title is required"),
    body("alamat").notEmpty().withMessage("Description is required"),
    body("pelajaran").notEmpty().withMessage("Pelajaran is required"),
  ];

  const validationErrors = await runValidation(validation, { name, alamat, pelajaran });
  if (validationErrors) {
    return { status: false, message: 'Validation errors', error: validationErrors };
  }
  try {
    const [updatedCrud] = await connection.query('update crud set name =?, alamat =?, pelajaran =?, where id =? and auth_id =?', [name, alamat, pelajaran, crudId, authId]);
    if (updatedCrud.affectedRows === 0) {
      return {
        status: false,
        message: 'Crud not found'
      }
    }
    const result = {
      id: Number(crudId),
      name, alamat, pelajaran, authId
    }
    return {
      status: true,
      message: 'Crud has been updated',
      data: result
    }
  } catch (error) {
    console.log(error);
  }
}

