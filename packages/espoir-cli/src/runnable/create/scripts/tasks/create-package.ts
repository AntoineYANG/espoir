/*
 * @Author: Kanata You 
 * @Date: 2022-01-23 20:26:10 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-26 16:55:15
 */

import * as fs from 'fs';
import * as path from 'path';
import { sync as mkdirp } from 'mkdirp';

import type { RepoPackageConfig } from './package-setup';
import env, { PackageJSON } from '@env';
import loadTemplate from '@@create/utils/load-template';


const createPackage = async (config: RepoPackageConfig): Promise<PackageJSON> => {
  const dir = env.resolvePathInPackage(config.name);

  mkdirp(dir);

  fs.writeFileSync(
    path.join(dir, 'README.md'),
    `# ${config.name}\n\n`, {
      encoding: 'utf-8'
    }
  );

  const gitUrl = env.rootPkg?.repository?.url;

  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify(
      {
        name: config.name,
        version: config.version,
        description: 'Generated by espoir',
        espoirVersion: env.version,
        repository: gitUrl ? {
          type: 'git',
          url: gitUrl,
          directory: `packages/${config.name}`
        } : undefined,
        contributors: config.contributors,
        bugs: gitUrl ? {
          url: gitUrl.replace(/\.git$/, '/issues')
        } : undefined,
        homepage: gitUrl ? (
          gitUrl.replace(/\.git$/, `/blob/main/packages/${config.name}/README.md`)
        ) : undefined,
        scripts: {},
        dependencies: {},
        devDependencies: config.enableTS ? {
          typescript: '*'
        } : {},
        peerDependencies: {
          'espoir-cli': `^${env.runtime.espoir.version}`
        }
      },
      undefined,
      2
    ) + '\n', {
      encoding: 'utf-8'
    }
  );

  if (config.template !== 'none' && await loadTemplate(config.name, config.enableTS, config.template)) {
    // created successfully with template

    return JSON.parse(
      fs.readFileSync(
        path.join(dir, 'package.json'), {
          encoding: 'utf-8'
        }
      )
    );
  }

  // else: no template

  mkdirp(path.join(dir, 'configs'));
  mkdirp(path.join(dir, 'scripts'));
  mkdirp(path.join(dir, 'tasks'));
  mkdirp(path.join(dir, 'src'));

  if (config.enableTS) {
    mkdirp(path.join(dir, 'typings'));

    fs.writeFileSync(
      path.join(dir, 'tsconfig.json'),
      JSON.stringify({
        extends: '../../tsconfig.base.json',
        include: ['./src/**/*'],
        exclude: ['node_modules', '.modules'],
        compilerOptions: {
          baseUrl: 'src',
          module: 'CommonJS',
          moduleResolution: 'Node',
          paths: {
            '@src/*': ['*']
          },
          declaration: false,
          preserveConstEnums: true,
          removeComments: false,
          sourceMap: false,
          allowJs: false,
          resolveJsonModule: true,
          target: 'ESNext',
          isolatedModules: true,
          allowUnusedLabels: false,
          alwaysStrict: true,
          exactOptionalPropertyTypes: true,
          noFallthroughCasesInSwitch: true,
          noImplicitAny: true,
          noImplicitOverride: true,
          noImplicitReturns: true,
          noImplicitThis: true,
          noPropertyAccessFromIndexSignature: true,
          noUncheckedIndexedAccess: true,
          strict: true,
          strictBindCallApply: true,
          strictFunctionTypes: true,
          strictNullChecks: true,
          strictPropertyInitialization: true,
          useUnknownInCatchVariables: false,
          rootDirs: [
            'src/', '../../node_modules/'
          ],
          typeRoots: ['../../node_modules/@types/'],
        }
      },
        undefined,
        2
      ) + '\n', {
        encoding: 'utf-8'
      }
    );
  }

  return JSON.parse(
    fs.readFileSync(
      path.join(dir, 'package.json'), {
        encoding: 'utf-8'
      }
    )
  );
};


export default createPackage;
