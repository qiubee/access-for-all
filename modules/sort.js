function isOrdered(array) {
	for (let i = 0; i < array.length; i++) {
		if (array[i] > array[i + 1]) {
			return false;
		}
	}
	return true;
}

exports.isOrdered = isOrdered;