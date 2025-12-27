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

    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },

    jwt: {
        accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
        refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresInAccess_token: process.env.JWT_EXPIRE_IN_ACCESS_TOKEN || '7d',
        expireInRefreshToken: process.env.JWT_EXPIRE_IN_REFRESH_TOKEN || '30d',
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

