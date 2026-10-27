export function getNextPageNumber(lastPage) {
  if (!lastPage) return undefined;
  return lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined;
}

export function flattenPages(data, key = "items") {
  return (data?.pages ?? []).flatMap((page) => page[key] ?? []);
}
