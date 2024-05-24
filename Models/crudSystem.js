const connection = require('../Config/Connection');
const { body, validationResult } = require('express-validator');
const runValidation = require('../Config/Validation');

async function listCrud(authId) {
  try {
    const [crud] = await connection.query('select * from teacher where auth_id = ?', [authId]);
    return { status: true, message: 'success get crud', data: crud };
  } catch (error) {
    console.log(error);
  }
}
async function createCrud(name, alamat, pelajaran, authId) {
  // cek validasi
  const validation = [
    body("name").notEmpty().withMessage("name is required"),
    body("alamat").notEmpty().withMessage("alamat is required"),
    body("pelajaran").notEmpty().withMessage("pelajaran is required"),
  ];

  const validationErrors = await runValidation(validation, { name, alamat, pelajaran });
  if (validationErrors) {
    return { status: false, message: 'Validation errors', error: validationErrors };
  }

  try {
    const [newCrud] = await connection.query('insert into teacher (name, alamat, pelajaran, auth_id) values (?,?,?,?)', [name, alamat, pelajaran, authId]);
    return {
      status: true, message: 'Crud has been created', data: {
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
    const [crud] = await connection.query('select * from teacher where id =? and auth_id =?', [crudId, authId]);
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
    body("alamat").notEmpty().withMessage("Alamat is required"),
    body("pelajaran").notEmpty().withMessage("Pelajaran is required"),
  ];

  const validationErrors = await runValidation(validation, { name, alamat, pelajaran });
  if (validationErrors) {
    return { status: false, message: 'Validation errors', error: validationErrors };
  }
  try {
    const [updatedCrud] = await connection.query('update teacher set name =?, alamat =?, pelajaran =?  where id =? and auth_id =?', [name, alamat, pelajaran, crudId, authId]);
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
async function deleteCrud(crudId, authId) {
  try {
    const [deletedCrud] = await connection.query('delete from teacher where id =? and auth_id =?', [crudId, authId]);
    return {
      status: true,
      message: 'Crud has been deleted',
      data: deletedCrud
    }
  } catch (error) {
    console.log(error);
  }

}


module.exports = {
  listCrud,
  createCrud,
  showCrud,
  updateCrud,
  deleteCrud
  
}