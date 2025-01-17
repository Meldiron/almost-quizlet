let _storeTitle: string = $state('•••');
export const storeTitle = {
	get value() {
		return _storeTitle;
	},
	set value(newVal) {
		_storeTitle = newVal;
	}
};
