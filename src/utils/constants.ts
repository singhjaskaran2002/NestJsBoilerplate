export const messages = {
	SUCCESS: 'Success.',
	LOGIN_SUCCESSFULLY: 'Logged in successfully.',
	REGISTER_SUCCESSFULLY: 'Registered successfully.',
};

export const apiDescriptions = {
	LOGIN_API: 'Route for logging into the system.',
	REGISTER_API: 'Route for registering into the system.',
	PROFILE_API: "Route for fetching logged user's profile from the system.",
};

export const errorMessages = {
	USER_NOT_FOUND: 'User not found!',
	INVALID_PASSWORD: 'Invalid password.',
	REGISTERATION_FAILED: 'User registration failed!',
	USER_ALREADY_EXISTS: 'User already associated with this email.',
	JWT_TOKEN_ERROR: 'Token has been expired.',
};

export const dtoFieldsDescription = {
	USER_NAME: "User's name.",
	USER_PASSWORD: "User's password.",
	USER_EMAIL: "User's email.",
};

export const dtoFieldsError = {
	INVALID_FIELD_STRING: 'Invalid @field string entered.',
	INVALID_EMAIL: 'Invalid email entered.',
};

export const serverEnvironments = {
	DEV: 'development',
	PROD: 'production',
	STAG: 'staging',
};

export const defaultExcludedAttributes = [
	'createdAt',
	'updatedAt',
	'deletedAt',
];
