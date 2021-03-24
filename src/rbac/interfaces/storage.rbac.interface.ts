import { IFilterPermission } from '../permissions/interfaces/filter.permission.interface';

export interface IStorageRbac {
  roles: string[];
  permissions: { [key: string]: any };
  grants: { [key: string]: any };
  filters: { [key: string]: any | IFilterPermission };
}
