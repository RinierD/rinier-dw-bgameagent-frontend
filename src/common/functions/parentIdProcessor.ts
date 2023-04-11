export const parentIdProcessor = (data: any[]) => {
	const processedData = data.map((elem) => {
		delete elem.parent_id;
		return elem;
	});
	return processedData;
};
