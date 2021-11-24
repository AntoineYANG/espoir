/*
 * @Author: Kanata You 
 * @Date: 2021-11-22 00:23:22 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-23 20:16:21
 */

import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';

import type { InstallResult } from '@@install/utils/download-deps';
import map from '@@install/utils/map';
import type { SingleDependency } from '@@install/utils/load-dependencies';
import type { LockData } from '@@install/utils/lock';


const createLinks = <T extends {
  dependencies: SingleDependency[];
  lockData: LockData;
  installResults: InstallResult[];
}>(): ListrTask<T, typeof DefaultRenderer> => ({
  title: 'Linking.',
  task: async (ctx, task) => {
    task.output = 'Linking /node_modules/';
    await map(
      ctx.dependencies,
      ctx.lockData,
      ctx.installResults,
      log => {
        task.output = log;
      }
    );
    task.output = 'Linked successfully';
  }
});


export default createLinks;