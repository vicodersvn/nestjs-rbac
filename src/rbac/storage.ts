import { IStorageRbac } from './interfaces/storage.rbac.interface';

export const RBACstorage: IStorageRbac = {
  roles: ['admin', 'user'],
  permissions: {
    post: ['readAny', 'deleteOwn', 'create', 'update', 'delete'],
    user: ['create', 'update', 'delete'],
    profile: ['readOwn', 'updateOwn', 'readAny', 'updateAny'],
  },
  grants: {
    admin: ['&user', 'user', 'post', 'profile'],
    user: [
      'profile@readOwn',
      'profile@updateOwn',
      'post@readAny',
      'post@deleteOwn',
    ],
  },
  filters: {},
};
