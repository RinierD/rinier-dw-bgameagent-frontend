import * as dotenv from 'dotenv';

module.exports = {
  client: {
    includes: ['./src/**/*.{tsx,ts}'],
    tagName: 'gql',
    service: {
      name: 'dw-cms',
      url: `${process.env.REACT_APP_URL?.slice(
        0,
        process.env.REACT_APP_URL.length - 1
      )}`,
      skipSSLValidation: true,
    },
  },
};
