import * as migration_20260801_170231_initial from './20260801_170231_initial';
import * as migration_20260906_090900_services_projects_company from './20260906_090900_services_projects_company';

export const migrations = [
  {
    up: migration_20260801_170231_initial.up,
    down: migration_20260801_170231_initial.down,
    name: '20260801_170231_initial',
  },
  {
    up: migration_20260906_090900_services_projects_company.up,
    down: migration_20260906_090900_services_projects_company.down,
    name: '20260906_090900_services_projects_company'
  },
];
