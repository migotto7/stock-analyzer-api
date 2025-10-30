module.exports = {
    verbose: true,

    // Collect coverage only for routes and controllers
    collectCoverage: true,
    collectCoverageFrom: [
      "src/routes/**/*.js",
      "src/controllers/**/*.js"
    ],
    // Use V8 coverage provider which works well with native ESM and Node >= 14
    coverageProvider: 'v8',
    // Ignore node_modules from coverage
    coveragePathIgnorePatterns: ["/node_modules/"],

    // Coverage thresholds (global) — 90%
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },

    testEnvironment: 'node',
    // Avoid transforming files (keeps native ESM and top-level await behavior).
    // Note: Jest will infer .js as ESM from package.json "type": "module".
    transform: {},
};
