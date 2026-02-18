export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export const getPaginationParams = (query: any): Required<PaginationParams> => {
    return {
        page: parseInt(query.page) || 1,
        limit: parseInt(query.limit) || 10,
        sortBy: query.sortBy || 'createdAt',
        sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc',
    };
};

export const createPaginationResult = <T>(
    data: T[],
    total: number,
    page: number,
    limit: number
): PaginationResult<T> => {
    const totalPages = Math.ceil(total / limit);

    return {
        data,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
};
