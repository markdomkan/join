import { providers } from '$lib/providers';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	await providers.init();
};
