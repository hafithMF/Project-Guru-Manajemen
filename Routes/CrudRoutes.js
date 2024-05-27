const express = require('express');
const router = express.Router();
const { getCrud, addCrud, updateCrudById, deleteCrudById, searchCrudData} = require('../Controllers/CrudConroller');
const verifyToken = require('../Middleware/VerifyToken');

router.get('/list', verifyToken, getCrud);
router.post('/create', verifyToken, addCrud);
router.patch('/:id/update', verifyToken, updateCrudById);
router.delete('/:id/delete', verifyToken, deleteCrudById);
router.get('/search', verifyToken, searchCrudData);

module.exports = router;