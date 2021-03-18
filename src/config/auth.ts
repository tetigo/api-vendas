export default {
  jwt: {
    secret: process.env.APP_SECRET as string,
    expiresIn : process.env.APP_EXPIRES_IN as string,
  }
}

