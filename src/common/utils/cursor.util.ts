export function sliceCursorResults<T>(
  rows: T[],
  limit: number,
): { items: T[]; hasNextPage: boolean } {
  const hasNextPage = rows.length > limit;
  const items = hasNextPage ? rows.slice(0, limit) : rows;
  return { items, hasNextPage };
}
