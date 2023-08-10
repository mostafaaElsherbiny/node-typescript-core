import FilterParametersInterface from '@utils/interfaces/FilterParametersInterface';
import PaginationResponseInterface from '@utils/interfaces/PaginationResponseInterface';
import { Document, Query } from 'mongoose';

let paginate = async <T>(filter: FilterParametersInterface, data: any, countQuery): Promise<PaginationResponseInterface<T>> => {
	const pageNumber = filter.page ?? 1; // The current page number
	const pageSize = filter.size ?? 1; // Number of documents per page
	const count = await countQuery;
	const totalPages = Math.ceil(+count / pageSize);
	const hasNextPage = pageNumber < totalPages;
	const hasPreviousPage = pageNumber > 1;
	const nextPage = hasNextPage ? pageNumber + 1 : null;
	const previousPage = hasPreviousPage ? pageNumber - 1 : null;
	const dataPage = await data.skip((pageNumber - 1) * pageSize).limit(pageSize);
	return {
		count,
		hasNextPage,
		hasPreviousPage,
		nextPage,
		previousPage,
		totalPages,
		data: dataPage,
	};
};

export let paginateResponse = async (filter: FilterParametersInterface, data: Promise<Document[]>, countQuery: Promise<number>, transformer: Function) => {
	let response = await paginate(filter, data, countQuery);

	if (response.data) {
		let transformedData = transformer(response.data);
		response.data = transformedData;
	}
	return response as PaginationResponseInterface<any>;
};
export default paginate;
