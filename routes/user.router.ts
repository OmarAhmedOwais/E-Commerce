import { Router } from 'express';

import { protectedMiddleware } from '../middlewares/protected.middleware';
import { allowedTo } from '../middlewares/allowedTo.middleware';
import { Role } from '../interfaces/user/user.interface';
import {
  addAdmin,
  addRole,
  deleteUserById,
  getAllUsers,
  getUserById,
  getLoggedUser,
  getAllAdmins,
  updateLoggedUser,
  getAllAddressesForLoggedUser,
  deleteAddressForLoggedUserById,
} from '../controllers/user.controller';
import {
  addRoleValidation,
  addAdminValidation,
} from '../validations/user.validator';
import { limitsMiddleware } from '../middlewares/limits.middleware';

const userRouter = Router();
userRouter
  .route('/getAllAdmins')
  .get(
    protectedMiddleware,
    allowedTo(
      Role.RootAdmin,
      Role.AdminA,
      Role.AdminB,
      Role.AdminC,
      Role.SubAdmin,
    ),
    getAllAdmins,
  ); //admin root

userRouter.route('/').get(protectedMiddleware, getAllUsers); //admin root admina adminb adminc subadmin

userRouter
  .route('/getAllAddressesForLoggedUser')
  .get(protectedMiddleware, getAllAddressesForLoggedUser);

userRouter
  .route('/updateLoggedUser')
  .put(protectedMiddleware, updateLoggedUser);

userRouter.route('/getMe').get(protectedMiddleware, getLoggedUser);

userRouter
  .route('/addAdmin')
  .post(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA),
    limitsMiddleware('User'),
    addAdminValidation,
    addAdmin,
  );

userRouter
  .route('/:id')
  .get(protectedMiddleware, getUserById)
  .delete(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA),
    deleteUserById,
  );

userRouter
  .route('/:id/addRole')
  .put(
    protectedMiddleware,
    allowedTo(Role.RootAdmin, Role.AdminA),
    addRoleValidation,
    addRole,
  );

userRouter
  .route('/deleteAddressForLoggedUser/:id')
  .delete(protectedMiddleware, deleteAddressForLoggedUserById);

export default userRouter;
