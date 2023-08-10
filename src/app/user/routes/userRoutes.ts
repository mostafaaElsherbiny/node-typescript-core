import express from 'express';
import verifyToken from '@modules/auth/middlewares/auth';
import UserController from '../controllers/UserController';
import validateAsyncRequest from '../../core/middlewares/validateAsyncRequest';
import { userValidationSchema } from '../validations/user/userValidationSchema';
import { updateUserValidationSchema } from '../validations/user/updateUserValidationSchema';
import UserRole from '../enums/UserRoleEnum';
import ProfileController from '../controllers/ProfileController';
import onlyCan from '@modules/auth/middlewares/onlyCan';
import { updateProfileValidationSchema } from '../validations/profile/updateProfileValidationSchema';
const router = express.Router();

/**
 * users crud routes
 */
router.get('/', onlyCan([UserRole.SuperAdmin]), UserController.getAll);

router.get('/:id([0-9a-fA-F]{24})', onlyCan([UserRole.SuperAdmin]), UserController.show);

router.post('/', validateAsyncRequest(userValidationSchema, true), onlyCan([UserRole.SuperAdmin]), UserController.store);

//this regular expression is used to validate the id of the user to just allow the id to be a valid mongo id
router.put('/:id([0-9a-fA-F]{24})', validateAsyncRequest(updateUserValidationSchema, true), onlyCan([UserRole.SuperAdmin]), UserController.update);

router.delete('/:id([0-9a-fA-F]{24})', onlyCan([UserRole.SuperAdmin]), UserController.delete);

/*
 *
 *  profile routes
 *
 */

router.put('/profile', validateAsyncRequest(updateProfileValidationSchema, true), ProfileController.updateProfile);

router.delete('/profile', ProfileController.deleteAccount);

router.delete('/profile/delete-profile-image', ProfileController.deleteProfileImage);

router.put('/profile/deactivate', ProfileController.deactivateAccount);
export { router as userRoutes };
