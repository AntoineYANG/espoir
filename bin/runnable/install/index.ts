/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 02:00:17 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-20 23:30:55
 */

import { Argument, Option } from 'commander';

import { ExitCode } from '../..';
import RunnableScript from '..';
import env from '../../utils/env';
import installAll from './scripts/install-all';
import installAndSave from './scripts/install-and-save';


const installTarget = [
  ...env.packages,
  'root'
]

const Install: RunnableScript = {
  fullName: 'install',
  displayName: 'install',
  aliases: ['i', 'ins'],
  description: 'install modules',
  usage: '[option] [module-names...] [workspace]',
  args: [
    new Argument(
      '[module-names...]',
      'NPM package(s) to install'
    )
  ],
  options: [
    new Option(
      '-S, --save',
      'install and save as package dependencies'
    ).default(true),
    new Option(
      '-D, --save-dev',
      'install and save as package devDependencies'
    ).default(false),
    new Option(
      '--production'
    ).default(false),
    new Option(
      '-w, --workspace <workspace...>',
      'included packages in the current workspace'
    ).choices(installTarget).default(installTarget, 'all packages')
  ],
  exec: async (
    moduleNames: string[],
    options: {
      save: boolean;
      saveDev: boolean;
      production: boolean;
      workspace: string[];
    }
  ) => {
    if (moduleNames.length === 0) {
      return installAll(options.production, options.workspace);
    } else if (options.production) {
      const msg = `When use \`install --production\`, ${
        'it\'s not supposed to give `moduleNames`. '
      }`;

      throw new Error(msg);
    } else if (options.saveDev) {
      return installAndSave(moduleNames, options.workspace, 'devDependencies');
    } else if (options.save) {
      if (options.workspace.includes('root')) {
        const msg = `${
          'Cannot install modules as dependencies of the root package. '
        }${
          options.workspace === installTarget ? (
            'Did you forget to set `--workspace|-w` option? '
          ) : ''
        }`;

        throw new Error(msg);
      } else {
        return installAndSave(moduleNames, options.workspace, 'dependencies')
      }
    }

    return ExitCode.OPERATION_FAILED;
  }
};

export default Install;
