/*
 * @Author: yangsen
 * @Date: 2022-04-06 17:44:44
 * @LastEditTime: 2024-11-27 11:30:53
 * @Description: file content
 */
module.exports = {
  extends: [
    "alloy",
    "alloy/react",
    "alloy/typescript",
    "plugin:react-hooks/recommended",
  ],
  env: {
    // Your environments (which contains several predefined global variables)
    //
    // browser: true,
    // node: true,
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // Your global variables (setting to false means it's not allowed to be reassigned)
    //
    // myGlobal: false
  },
  rules: {
    // Customize your rules
    "no-constant-binary-expression": "off",
    "no-new-native-nonconstructor": "off",
  },
};
