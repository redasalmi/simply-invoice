import type { PaginationType, UserSetting } from "~/types";

export const paginationTypes = {
	previous: "previous",
	next: "next",
};

export const cursorParam = "cursor";
export const paginationTypeParam = "pagination-type";
export const itemsPerPageParam = "items-per-page";

const defaultItemsPerPage = 10;

export function getPaginationParams(
	requestUrl: string,
	userSettings?: UserSetting,
) {
	const url = new URL(requestUrl);
	const cursor = url.searchParams.get(cursorParam);
	const paginationType = url.searchParams.get(paginationTypeParam);
	let itemsPerPage = url.searchParams.get(itemsPerPageParam);

	if (!itemsPerPage && userSettings) {
		itemsPerPage = userSettings.settingValue;
	}

	return {
		cursor,
		paginationType: paginationType as PaginationType | null,
		itemsPerPage: itemsPerPage ? Number(itemsPerPage) : defaultItemsPerPage,
	};
}
