
module.exports = function(config) {
    config.set({
        basePath: '../src',
        frameworks: ["jasmine", "karma-typescript"],

        files: [
            "../library-build-chain/karma.base.spec.ts",
            { pattern: "**/*.ts" }
        ],

        preprocessors: {
            "**/*.ts": ["karma-typescript"]
        },

        karmaTypescriptConfig: {
            bundlerOptions: {
                entrypoints: /\.spec\.ts$/,
                transforms: [
                    require("karma-typescript-angular2-transform")
                ]
            },
            compilerOptions: {
                lib: ["ES2015", "DOM"]
            }
        },

        reporters: ["spec"],

        browsers: [
            'ChromeSmall'
        ],
        customLaunchers: {
            ChromeSmall: {
                base: 'Chrome',
                flags: [
                  '--window-size=300,300',
                  '--disable-gpu',
                  '--no-sandbox',
                ]
            }
        },
    });
};
