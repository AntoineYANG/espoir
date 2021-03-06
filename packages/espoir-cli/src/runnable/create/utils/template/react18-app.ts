/*
 * @Author: Kanata You 
 * @Date: 2022-01-23 21:48:40 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-04-20 17:46:43
 */

import * as path from 'path';
import * as fs from 'fs';
import { sync as mkdirp } from 'mkdirp';
import * as inquirer from 'inquirer';

import env from '@env';
import type { EspoirTemplate } from '@@create/utils/load-template';


const copy = (dir: string, dest: string): void => {
  if (!fs.existsSync(dest)) {
    mkdirp(dest);
  }

  fs.readdirSync(dir).forEach(n => {
    const source = path.join(dir, n);
    const target = path.join(dest, n);

    if (fs.statSync(source).isDirectory()) {
      copy(source, target);
    } else {
      fs.copyFileSync(source, target);
    }
  });
};

const reactAppTemplate: EspoirTemplate = {
  name: 'React18 app',
  create: async (name, enableTS) => {
    const dir = env.resolvePathInPackage(name);

    mkdirp(path.join(dir, 'configs'));
    mkdirp(path.join(dir, 'scripts'));
    mkdirp(path.join(dir, 'tasks'));
    mkdirp(path.join(dir, 'src'));

    mkdirp(path.join(dir, 'public', 'images'));

    // public dir

    ['favicon.ico', 'logo192.png', 'logo512.png', 'manifest.json', 'robots.txt'].forEach(n => {
      const source = path.join(__dirname, '..', '..', '..', '..', '..', 'public', n);

      fs.copyFileSync(source, path.join(dir, 'public', n));
    });

    fs.writeFileSync(
      path.join(dir, 'public', 'index.html'),
      `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using espoir"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>${name}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`, {
        encoding: 'utf-8'
      }
    );

    const { useSass } = await inquirer.prompt([{
      type: 'confirm',
      name: 'useSass',
      message: 'Use sass?'
    }]);

    mkdirp(path.join(dir, 'src', 'components'));
    mkdirp(path.join(dir, 'src', 'context'));
    mkdirp(path.join(dir, 'src', 'typings'));
    mkdirp(path.join(dir, 'src', 'utils'));
    mkdirp(path.join(dir, 'src', 'views'));

    fs.writeFileSync(
      path.join(dir, 'src', enableTS ? 'index.tsx' : 'index.jsx'),
      `/** ESPOIR TEMPLATE */
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@views';

import './index.scss';


const container = document.getElementById('root');

if (!container) {
  throw new Error(\`container Node "#root" not found\`);
}

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`, {
        encoding: 'utf-8'
      }
    );

    fs.writeFileSync(
      path.join(dir, 'src', useSass ? 'index.scss' : 'index.css'),
      `/** ESPOIR TEMPLATE */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  background-color: #000;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
`, {
        encoding: 'utf-8'
      }
    );

    fs.writeFileSync(
      path.join(dir, 'src', 'views', enableTS ? 'index.tsx' : 'index.jsx'),
      `/** ESPOIR TEMPLATE */
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';


const App${enableTS ? ': React.FC' : ''} = () => (
  <Router>
    <Routes>
      <Route path="/" element={ <></> } />
    </Routes>
  </Router>
);

export default App;
`, {
        encoding: 'utf-8'
      }
    );

    if (enableTS) {
      fs.writeFileSync(
        path.join(dir, 'tsconfig.json'),
        JSON.stringify({
          extends: '../../tsconfig.base.json',
          include: ['./src/**/*'],
          exclude: ['node_modules', '.modules'],
          compilerOptions: {
            target: 'es5',
            lib: [
              'dom',
              'dom.iterable',
              'esnext'
            ],
            allowJs: true,
            skipLibCheck: true,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            strict: true,
            forceConsistentCasingInFileNames: true,
            noFallthroughCasesInSwitch: true,
            module: 'esnext',
            moduleResolution: 'node',
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: 'react-jsx',
            baseUrl: '.',
            paths: {
              '@components/*': ['./src/components/*'],
              '@context/*': ['./src/context/*'],
              '@views': ['./src/views/'],
              '@views/*': ['./src/views/*'],
              '@objects': ['./src/objects'],
              '@objects/*': ['./src/objects/*'],
              '@utils/*': ['./src/utils/*'],
              '@public/*': ['./public/*']
            }
          },
        },
          undefined,
          2
        ) + '\n', {
          encoding: 'utf-8'
        }
      );
    }

    const packageJSON = {
      ...require(path.join(dir, 'package.json')),
      dependencies: {
        '@babel/core': '^7.16.12',
        '@babel/plugin-proposal-private-property-in-object': '^7.16.7',
        '@babel/runtime': '7.12.1',
        '@pmmmwh/react-refresh-webpack-plugin': '^0.5.4',
        'babel-loader': '^8.2.3',
        'babel-plugin-named-asset-import': '^0.3.8',
        'babel-plugin-react-anonymous-display-name': '^0.1.0',
        'babel-preset-react-app': '^10.0.1',
        browserslist: '^4.20.0',
        'case-sensitive-paths-webpack-plugin': '^2.4.0',
        chalk: '^5.0.0',
        'css-loader': '^6.7.1',
        eslint: '^7.32.0',
        'eslint-config-react-app': '^7.0.0',
        'eslint-webpack-plugin': '^3.1.1',
        'file-loader': '^6.2.0',
        'fs-extra': '^10.0.1',
        'html-webpack-plugin': '^5.5.0',
        'mini-css-extract-plugin': '^2.6.0',
        nanoid: '^3.3.1',
        postcss: '^8.4.8',
        'postcss-loader': '^6.2.1',
        'postcss-normalize': '^10.0.1',
        'postcss-preset-env': '^7.4.2',
        'postcss-safe-parser': '^6.0.0',
        react: '^18.0.0',
        'react-dev-utils': '^12.0.0',
        'react-dom': '^18.0.0',
        'react-router-dom': '^6.2.1',
        resolve: '^1.22.0',
        'resolve-url-loader': '^5.0.0',
        sass: '^1.49.0',
        'sass-loader': '^12.6.0',
        'url-loader': '^4.1.1',
        webpack: '^5.70.0',
        'webpack-manifest-plugin': '^5.0.0'
      },
      devDependencies: enableTS ? {
        '@types/react': '^18.0.0',
        '@types/react-dom': '^18.0.0',
        '@types/react-router-dom': '>=5',
        ajv: '^8.8.2',
        eslint: '^7.32.0',
        'eslint-plugin-no-memo-displayname': '^0.0.1',
        'eslint-plugin-react': '^7.29.4',
        'react-refresh': '^0.11.0',
        'style-loader': '^3.3.1',
        typescript: '>=4',
        'webpack-dev-server': '^4.7.3'
      } : {
        ajv: '^8.8.2',
        eslint: '^7.32.0',
        'eslint-plugin-no-memo-displayname': '^0.0.1',
        'eslint-plugin-react': '^7.29.4',
        'react-refresh': '^0.11.0',
        'style-loader': '^3.3.1',
        'webpack-dev-server': '^4.7.3'
      },
      eslintConfig: {
        extends: [
          'react-app',
          'react-app/jest'
        ]
      },
      browserslist: {
        production: [
          '>0.2%',
          'not dead',
          'not op_mini all'
        ],
        development: [
          'last 1 chrome version',
          'last 1 firefox version',
          'last 1 safari version'
        ]
      },
      babel: {
        presets: [
          'react-app'
        ]
      },
      alias: {
        '@components': './src/components/',
        '@context': './src/context/',
        '@views': './src/views/',
        '@utils': './src/utils/',
        '@public': './public/'
      }
    };

    fs.writeFileSync(
      path.join(dir, 'package.json'),
      JSON.stringify(
        packageJSON,
        undefined,
        2
      ) + '\n', {
        encoding: 'utf-8'
      }
    );

    // scripts

    copy(
      path.join(__dirname, '..', '..', '..', '..', '..', 'public', 'react-app-scripts'),
      path.join(dir, 'scripts')
    );

    // configs

    fs.writeFileSync(
      path.join(dir, 'configs', '.eslintrc.json'),
      `{
  // Prevent eslint from looking for configuration files
  // in all parent folders up to the root directory.
  "root": true,
  "plugins": [
    "react",
    "eslint-plugin-no-memo-displayname"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "rules": {
    "react/jsx-pascal-case": ["error", {
      "allowLeadingUnderscore": true
    }]${
      enableTS ? `,
    // Since TS is enabled,
    // we don't and don't ever need to trust the react/prop-types rule.
    "react/prop-types": "off"` : ''
    }
  },
  "parserOptions": {
    // Use ES6
    "ecmaVersion": 6
  },
  "env": {
    "node": true,
    "browser": true,
    "commonjs": true,
    "amd": true
  }
}
`, {
      encoding: 'utf-8'
    });

    fs.writeFileSync(
      path.join(dir, 'configs', 'dev-proxy.js'),
      `/**
 * @type {import('webpack-dev-server').Configuration['proxy']}
 */
const proxyConfig = {};

module.exports = proxyConfig;
`, {
      encoding: 'utf-8'
    });

    fs.writeFileSync(
      path.join(dir, 'configs', 'path.json'),
      JSON.stringify({
        rootDir: '.',
        template: 'public/index.html',
        src: 'src',
        entry: `index.${enableTS ? 't' : 'j'}sx`,
        referencePath: '.',
        publicPath: 'public',
        output: 'build'
      }, undefined, 2) + '\n'
    );

    fs.writeFileSync(
      path.join(dir, 'configs', 'env.json'),
      JSON.stringify({
        APP_NAME: name
      }, undefined, 2) + '\n'
    );
  }
};


export default reactAppTemplate;
