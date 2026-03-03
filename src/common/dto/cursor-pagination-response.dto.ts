export class CursorPaginationResponseDto<T> {
  data!: T[];
  nextCursor!: string | null;
  hasNextPage!: boolean;
  limit!: number;
}
