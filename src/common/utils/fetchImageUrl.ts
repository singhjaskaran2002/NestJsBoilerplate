export const fetchImageUrl = (profilePicture: string) => {
	return `${process.env.SERVER_URL}/uploads/${profilePicture}`;
};
