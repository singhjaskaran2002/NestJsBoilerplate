export const messages = {
	SUCCESS: 'Success.',
	LOGIN_SUCCESSFULLY: 'Logged in successfully.',
	REGISTER_SUCCESSFULLY:
		'You have been registered successfully. Welcome mail has been sent to your email address.',
	PROFILE_UPDATED_SUCCESSFULLY: 'Profile updated successfully.',
	PASSWORD_CHANGED_SUCCESSFULLY: 'Password changed successfully.',
};

export const apiDescriptions = {
	LOGIN_API: 'Route for logging into the system.',
	REGISTER_API: 'Route for registering into the system.',
	PROFILE_API: "Route for fetching logged user's profile from the system.",
	UPDATE_USER_API: "Route for updating user's profile.",
	LIST_USER_API: "Route for listing users.",
	CHANGE_PASSWORD_API: "Route for changing user's password.",
};

export const errorMessages = {
	USER_NOT_FOUND: 'User not found!',
	INVALID_PASSWORD: 'Invalid password.',
	REGISTERATION_FAILED: 'User registration failed!',
	USER_ALREADY_EXISTS: 'User already associated with this email.',
	JWT_TOKEN_EXPIRED: 'Token has been expired.',
	CURRENT_PASSWORD_MISMATCHED: 'Current password mismatched.',
	SAME_PASSWORD: 'Choose different password from current one.',
	MIN_PASSWORD_ERROR: 'Password must be of atleast 8 characters',
	MAX_PASSWORD_ERROR: 'Password must not be greater than 30 characters',
	WHITESPACE_PASSWORD_ERROR:
		'Please enter a password with no whitespace characters',
};

export const dtoFieldsDescription = {
	USER_NAME: "User's name.",
	USER_PASSWORD: "User's password.",
	USER_EMAIL: "User's email.",
	USER_USERNAME: "User's unique usename.",
	USER_IMAGE: "User's profile picture.",
	USER_NEW_PASSWORD: "User's new password",
	USER_CURRENT_PASSWORD: "User's current passsword"
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

export const apiSecurities = {
	BEARER: 'bearer',
};

export const defaultExcludedAttributes = [
	'created_at',
	'updated_at',
	'deleted_at',
];

export const roles = {
	USER: 'user',
};
