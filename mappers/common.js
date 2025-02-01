
export function preparePaginatedResponse(results, total, page = 0, limit = 10) {
    const totalPages = Math.ceil(total / limit); 
    const currentPage = page + 1; 
    
    return {
        results,
        total,
        totalPages,
        currentPage,
        pageSize: limit
    };
}
