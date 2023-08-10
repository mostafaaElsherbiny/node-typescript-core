interface PaginationResponseInterface<T> {
	data: T[];
	count: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	nextPage: number | null;
	previousPage: number | null;
	totalPages: number;
}

export default PaginationResponseInterface;
