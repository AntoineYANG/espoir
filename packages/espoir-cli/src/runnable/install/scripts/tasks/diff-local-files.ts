/*
 * @Author: Kanata You 
 * @Date: 2021-11-22 00:15:40 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-23 20:16:54
 */

import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';

import { createLockData, LockData } from '@@install/utils/lock';
import type { VersionInfo } from '@request/request-npm';
import diffLocal from '@@install/utils/diff-local';


const diffLocalFiles = <T extends {
  resolvedDeps: VersionInfo[];
  diff: VersionInfo[];
  lockData: LockData;
}>(): ListrTask<T, typeof DefaultRenderer> => ({
  title: 'Diffing local files.',
  task: async (ctx, task) => {
    task.output = 'Checking installed modules';
    ctx.diff = await diffLocal(ctx.resolvedDeps);
    
    ctx.lockData = createLockData(ctx.lockData, ctx.diff);

    task.output = 'Diffing succeeded';
  }
});


export default diffLocalFiles;