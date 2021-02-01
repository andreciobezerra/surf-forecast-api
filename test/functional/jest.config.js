/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require("path");
const root = resolve(__dirname, "../..");
const rootConfig = require(`${root}/jest.config.js`);

module.exports = {
  ...rootConfig,
  rootDir: root,
  displayName: "end-to-end-test",
  setupFilesAfterEnv: ["<rootDir>/test/functional/jest-setup.ts"],
  testMatch: ["<rootDir>/test/functional/*.test.ts"],
};
