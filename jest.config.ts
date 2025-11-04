import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(gif|ttf|eot|png|jpg|jpeg)$": "<rootDir>/__mocks__/svgMock.js",
    "\\.(svg)$": "<rootDir>/__mocks__/svgMock.js",
    "^@assets/icons/(.*)\\.svg$": "<rootDir>/__mocks__/svgMock.js",
    "^@assets/(.*)$": "<rootDir>/src/assets/$1",
  },
};

export default config;
