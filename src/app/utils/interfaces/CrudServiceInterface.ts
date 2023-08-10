import FilterParametersInterface from './FilterParametersInterface';
import PaginationResponseInterface from './PaginationResponseInterface';

export default interface CrudServiceInterface<T, C> {
	create: (data: C) => Promise<T>;
	update: (id: String, data: C) => Promise<T | null>;
	delete: (id: String) => Promise<boolean>;
	getById: (id: String) => Promise<T | null>;
	all: (filter: FilterParametersInterface, ...args: any) => Promise<PaginationResponseInterface<T>>;
}
