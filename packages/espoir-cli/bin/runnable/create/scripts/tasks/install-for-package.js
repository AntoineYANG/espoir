"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 * @Author: Kanata You
 * @Date: 2022-01-26 13:58:40
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 15:04:56
 */

const inquirer = require("inquirer");

const install_all_1 = require("../../../install/scripts/install-all");

const _env_1 = require("../../../../utils/env");

const _lazy_1 = require("../../../../utils/lazy-readonly");

const installForPackage = async name => {
  const {
    doInstall
  } = await inquirer.prompt([{
    type: 'confirm',
    name: 'doInstall',
    message: 'Install now?',
    default: true
  }]);

  if (doInstall) {
    _env_1.default[_lazy_1.lazyUpdate](['packages', 'packageMap']);

    await (0, install_all_1.default)(false, [name]);
  }
};

exports.default = installForPackage;