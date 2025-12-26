export default () => ({
    nodeEnv: process.env.NODE_ENV || 'development',

    app: {
        port: Number(process.env.PORT) || 5000,
    },

    database: {
        url: process.env.DATABASE_URL,
    },

    bcrypt: {
        saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
    },

    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },

    jwt: {
        accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
        refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: process.env.JWT_EXPIRE_IN || '7d',
        resetPassSecret: process.env.RESET_PASSWORD_SECRET,
        resetPassExpiresIn: process.env.RESET_PASS_TOKEN_EXPIRE_IN || '10m',
    },

    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },

    email: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASS,
    },

    ai: {
        openRouterApiKey: process.env.OPEN_ROUTER_API_KEY,
    },

    resetPassLink: process.env.RESET_PASS_LINK,
});
