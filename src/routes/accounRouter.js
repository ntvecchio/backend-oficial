import express from 'express';
import createController from '../controllers/account/createController.js';
import getByIdController from '../controllers/account/getByIdController.js';
import listController from '../controllers/account/listController.js';
import updateController from '../controllers/account/updateController.js';
import removeController from '../controllers/account/removeController.js';
import { auth } from '../middlewares/auth.js';  // Certifique-se de que o nome do middleware seja 'auth'

const router = express.Router();

// Aplica o middleware de autenticação para todas as rotas
router.use(auth);

// Rotas
router.post('/', createController);
router.get('/list', listController);
router.get('/:id', getByIdController);
router.put('/update/:id', updateController); // Usar 'auth' diretamente aqui
router.delete('/:id', removeController);

export default router;
