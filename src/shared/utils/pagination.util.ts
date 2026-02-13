export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class PaginationUtil {
  static create<T>(data: T[], total: number, page: number, limit: number): PaginationResult<T> {
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static normalize(params: { page?: number; limit?: number }): PaginationParams {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 10));

    return { page, limit };
  }

  static getSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }
}
