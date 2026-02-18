import { Router } from 'express';
import * as classRoomController from '../controllers/classRoomController';
import { validateRequest } from '../utils/validateRequest';
import { createClassRoomSchema, updateClassRoomSchema } from '../validators/schemas';

const router = Router();

router.post('/', validateRequest(createClassRoomSchema), classRoomController.createClassRoom);
router.get('/', classRoomController.getAllClassRooms);
router.get('/:id', classRoomController.getClassRoomById);
router.get('/:id/students', classRoomController.getClassRoomStudents);
router.put('/:id', validateRequest(updateClassRoomSchema), classRoomController.updateClassRoom);
router.delete('/:id', classRoomController.deleteClassRoom);

export default router;
