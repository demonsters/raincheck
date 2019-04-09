
module.exports = function (wallaby) {

  return {
    files: [
      'src/**/*.js',
      '!src/**/test.js',
    ],

    tests: [
      'src/**/test.js',
      // 'packages/**/__tests__/*.js'
    ],

    env: {
      type: 'node',
      runner: 'node'
    },

    testFramework: 'jest',

    compilers: {
      '**/*.js': wallaby.compilers.babel(),
    },

  };
};