/*
 * @Author: Kanata You 
 * @Date: 2021-12-02 17:50:59 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-12-06 16:50:21
 */

import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';
import * as chalk from 'chalk';

import loadDependencies, { SingleDependency } from '@@install/utils/load-dependencies';
import { LockData, useLockFileData } from '@@install/utils/lock';
import { VersionInfo } from '@request/request-npm';
import { resolvePackageDeps } from '@@install/utils/resolve-deps';


/**
 * Initialize `ctx.dependencies` by resolving dependencies in required packages.
 *
 * @template T
 * @param {string[]} scopes
 * @param {boolean} isProd
 * @returns {ListrTask<T, typeof DefaultRenderer>}
 */
const usePackageDeps = <T extends {
  dependencies: SingleDependency[];
  lockData: LockData;
  resolvedDeps: VersionInfo[];
}>(
  scopes: string[],
  isProd: boolean
): ListrTask<T, typeof DefaultRenderer> => ({
  title: 'Loading all the explicit dependencies from all `package.json`.',
  task: async (ctx, task) => {
    // parse
    task.output = 'Resolving `package.json`';
    ctx.dependencies = loadDependencies(scopes, isProd);
    task.output = 'Successfully resolved `package.json`';

    ctx.lockData = useLockFileData();

    // resolve
    task.output = 'Resolving dependencies';
    const printProgress = (resolved: number, unresolved: number) => {
      task.output = chalk` \u23f3  {green ${resolved} }dependencies resolved, {yellow ${unresolved} }left`;
    };
    ctx.resolvedDeps = await resolvePackageDeps(
      ctx.dependencies,
      ctx.lockData,
      printProgress
    );

    task.output = 'Successfully resolved declared dependencies';
  }
});

export default usePackageDeps;
