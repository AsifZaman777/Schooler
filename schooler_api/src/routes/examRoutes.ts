import { Router } from 'express';
import * as examController from '../controllers/examController';
import { validateRequest } from '../utils/validateRequest';
import { createExamSchema, updateExamSchema, createExamMarkSchema, updateExamMarkSchema } from '../validators/schemas';

const router = Router();

// Exam routes
router.post('/', validateRequest(createExamSchema), examController.createExam);
router.get('/', examController.getAllExams);
router.get('/:id', examController.getExamById);
router.put('/:id', validateRequest(updateExamSchema), examController.updateExam);
router.delete('/:id', examController.deleteExam);

// Exam marks routes
router.post('/marks', validateRequest(createExamMarkSchema), examController.createExamMark);
router.get('/marks', examController.getAllExamMarks);
router.get('/marks/student/:studentId', examController.getStudentExamResults);
router.get('/marks/:id', examController.getExamMarkById);
router.put('/marks/:id', validateRequest(updateExamMarkSchema), examController.updateExamMark);
router.delete('/marks/:id', examController.deleteExamMark);

export default router;
