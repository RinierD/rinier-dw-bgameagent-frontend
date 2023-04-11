export const fromToFormatter = (date: Date | null) => {
	if (date) {
		const formattedStr = `${date.getFullYear()}/${
			(date.getMonth() + 1).toString().length === 1
				? '0' + (date.getMonth() + 1)
				: date.getMonth() + 1
		}/${
			date.getDate().toString().length === 1
				? '0' + date.getDate()
				: date.getDate()
		} ${
			date.getHours().toString().length === 1
				? '0' + date.getHours()
				: date.getHours()
		}:${
			date.getMinutes().toString().length === 1
				? '0' + date.getMinutes()
				: date.getMinutes()
		}`;
		return formattedStr;
	}
	return '';
};
