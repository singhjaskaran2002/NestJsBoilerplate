export default () => ({
	database: {
		host: process.env.DATABASE_HOST,
		port: parseInt(process.env.DATABASE_PORT),
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		dialect: process.env.DATABASE_DIALECT,
		database: process.env.DATABASE_NAME,
	},
	jwt: {
		secret: process.env.JWT_SECRET,
		signOptions: {
			algorithm: process.env.JWT_ALGORITHM,
		},
	},
	mailerOptions: {
		transport: {
			host: process.env.MAIL_HOST,
			secure: false,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
		},
		defaults: {
			from: process.env.MAIL_FROM,
		},
	},
});
