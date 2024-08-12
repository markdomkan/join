export const user: { name?: string; uid?: string; userIsValid(): boolean } = $state({
	name: undefined,
	uid: undefined,
	userIsValid() {
		return this.name !== undefined && this.name !== '' && this.uid !== undefined;
	}
});
