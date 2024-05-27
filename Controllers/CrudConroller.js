const { listCrud, createCrud, updateCrud, deleteCrud, searchCrud} = require('../Models/crudSystem');

async function getCrud(req, res) {
  try {
    const authId = req.auth.id;
    const Crud = await listCrud(authId);
    if (Crud.status) {
      res.status(200).json({
        status: Crud.status,
        message: Crud.message,
        data: Crud.data
      });
    }
  } catch (error) {
    console.log(error);
  }
}
async function addCrud(req, res) {
  try {
    const authId = req.auth.id;
    const { name, alamat, pelajaran } = req.body;
    const crud = await createCrud(name, alamat, pelajaran, authId);
    if (crud.status) {
      res.status(201).json({
        status: crud.status,
        message: crud.message,
        data: crud.data
      });
    }
  } catch (error) {
    console.log(error);
  }
}
async function updateCrudById(req, res) {
  try {
    const crudId = req.params.id;
    const authId = req.auth.id;
    const { name, alamat, pelajaran } = req.body;
    const crud = await updateCrud(crudId, name, alamat, pelajaran, authId);
    if (crud.status) {
      res.status(200).json({
        status: crud.status,
        message: crud.message,
        data: crud.data
      });
    }
  } catch (error) {
    console.log(error);
  }
}
async function deleteCrudById(req, res) {
  try {
    const crudId = req.params.id;
    const authId = req.auth.id;
    const crud = await deleteCrud(crudId, authId);
    if (crud.status) {
      res.status(200).json({
        status: crud.status,
        message: crud.message,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
async function searchCrudData(req, res) {
  try {
    const authId = req.auth.id;
    const query = req.query;
    const crud = await searchCrud(authId, query);
    if (crud.status) {
      res.status(200).json({
        status: crud.status,
        message: crud.message,
        data: crud.data
      });
    } else {
      res.status(404).json({
        status: crud.status,
        message: crud.message
      });
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getCrud,
  addCrud,
  updateCrudById,
  deleteCrudById,
  searchCrudData
}