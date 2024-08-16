'use strict';

import fs from 'fs';
import path from 'path';
import paths from './paths';
import chalk from 'react-dev-utils/chalk';
import resolve from 'resolve';

/**
 * Get additional module paths based on the baseUrl of a compilerOptions object.
 *
 * @param {Object} options
 */
const getAdditionalModulePaths = (options = {}) => {
  const { baseUrl } = options;

  if (!baseUrl) {
    return '';
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  if (path.relative(paths.appNodeModules, baseUrlResolved) === '') {
    return null;
  }

  if (path.relative(paths.appSrc, baseUrlResolved) === '') {
    return [paths.appSrc];
  }

  if (path.relative(paths.appPath, baseUrlResolved) === '') {
    return null;
  }

  throw new Error(
    chalk.red.bold(
      "Your project's `baseUrl` can only be set to `src` or `node_modules`." +
      ' Create React App does not support other values at this time.'
    )
  );
};

/**
 * Get webpack aliases based on the baseUrl of a compilerOptions object.
 *
 * @param {*} options
 */
const getWebpackAliases = (options = {}) => {
  const { baseUrl } = options;

  if (!baseUrl) {
    return {};
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  if (path.relative(paths.appPath, baseUrlResolved) === '') {
    return {
      src: paths.appSrc,
    };
  }
};

/**
 * Get jest aliases based on the baseUrl of a compilerOptions object.
 *
 * @param {*} options
 */
const getJestAliases = (options = {}) => {
  const { baseUrl } = options;

  if (!baseUrl) {
    return {};
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  if (path.relative(paths.appPath, baseUrlResolved) === '') {
    return {
      '^src/(.*)$': '<rootDir>/src/$1',
    };
  }
};

const getModules = () => {
  const hasTsConfig = fs.existsSync(paths.appTsConfig);
  const hasJsConfig = fs.existsSync(paths.appJsConfig);

  if (hasTsConfig && hasJsConfig) {
    throw new Error(
      'You have both a tsconfig.json and a jsconfig.json. If you are using TypeScript please remove your jsconfig.json file.'
    );
  }

  let config;

  if (hasTsConfig) {
    const ts = require(resolve.sync('typescript', {
      basedir: paths.appNodeModules,
    }));
    config = ts.readConfigFile(paths.appTsConfig, ts.sys.readFile).config;
  } else if (hasJsConfig) {
    config = require(paths.appJsConfig);
  }

  config = config || {};
  const { compilerOptions = {} } = config;

  const additionalModulePaths = getAdditionalModulePaths(compilerOptions);

  return {
    additionalModulePaths,
    webpackAliases: getWebpackAliases(compilerOptions),
    jestAliases: getJestAliases(compilerOptions),
    hasTsConfig,
  };
};

export default getModules();