import * as migration_20260801_170231_initial from './20260801_170231_initial';

export const migrations = [
  {
    up: migration_20260801_170231_initial.up,
    down: migration_20260801_170231_initial.down,
    name: '20260801_170231_initial'
  },
];
