import { Router } from 'express';
import * as departmentController from '../controllers/departmentController';
import { validateRequest } from '../utils/validateRequest';
import { createDepartmentSchema, updateDepartmentSchema } from '../validators/schemas';

const router = Router();

router.post('/', validateRequest(createDepartmentSchema), departmentController.createDepartment);
router.get('/', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartmentById);
router.put('/:id', validateRequest(updateDepartmentSchema), departmentController.updateDepartment);
router.delete('/:id', departmentController.deleteDepartment);

export default router;
