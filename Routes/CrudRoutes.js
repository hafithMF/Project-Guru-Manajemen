const express = require('express');
const router = express.Router();
const { getCrud, addCrud, CrudById, updateCrudById, deleteCrudById, crudById } = require('../Controllers/CrudConroller');

const verifyToken = require('../Middleware/VerifyToken');

router.get('', verifyToken, getCrud);
router.post('/create', verifyToken, addCrud);
router.get('/:id', verifyToken, crudById);
router.patch('/:id/update', verifyToken, updateCrudById);
router.delete('/:id/delete', verifyToken, deleteCrudById);


module.exports = router;