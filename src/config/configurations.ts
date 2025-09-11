import * as process from 'node:process';

export const configurations = () => ({
  deploymentEnv: process.env.DEPLOYED_ENVIRONMENT,
  auth: {
    jwt: process.env.JWT_SECRET || 'secret const',
  },
});
