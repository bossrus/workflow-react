const makeSlug = (str: string) => {
	return str
		.toLowerCase()
		.trim()
		.replace(/ /g, '-')
		.replace(/[^\wа-яёЁА-Я-]+/g, '');
};

export default makeSlug;
