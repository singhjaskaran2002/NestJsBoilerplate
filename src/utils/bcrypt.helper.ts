import * as bcrypt from 'bcrypt';

const saltOrRounds = +process.env.SALT;

// method for encrypting the password string
async function encryptPassword(password: string): Promise<string> {
	return await bcrypt.hash(password, saltOrRounds);
}

// method for checking the password string with hash
async function checkHash(password: string, hash: string): Promise<boolean> {
	return await bcrypt.compare(password, hash);
}

export { encryptPassword, checkHash };
