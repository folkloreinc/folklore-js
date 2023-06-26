import { cancelable } from 'cancelable-promise';
import isNumber from 'lodash/isNumber';
import { useEffect, useState, useMemo, useRef } from 'react';

export default function useItems(
    loader,
    {
        items: providedItems = null,
        getItemsFromResponse = (data) => data,
        onLoaded = null,
        onError = null,
    },
) {
    const lastState = useRef(null);
    const initialState = useMemo(
        () => ({
            total: (providedItems || []).length,
            loaded: providedItems !== null,
            loading: false,
            items: null,
        }),
        [providedItems],
    );
    const [state, setState] = useState(initialState);
    const { loaded, loading, items: stateItems, total } = state;
    const items = providedItems || stateItems || null;
    const updateState = (update) => setState({ ...state, ...update });
    const updateFromResponse = (response, error = null) => {
        if (error !== null) {
            updateState({
                loaded: false,
                loading: false,
            });
            throw error;
        }
        const newItems = [...getItemsFromResponse(response)];
        updateState({
            loaded: true,
            loading: false,
            items: newItems,
            total: newItems.length,
        });
        return newItems;
    };

    const loadItems = () => {
        updateState({
            loading: true,
        });

        return cancelable(loader())
            .then((response) => updateFromResponse(response))
            .catch((error) => updateFromResponse(null, error))
            .then((response) => {
                if (onLoaded !== null) {
                    onLoaded(response);
                }
                return response;
            })
            .catch((error) => {
                if (onError !== null) {
                    onError(error);
                }
            });
    };

    useEffect(() => {
        const hadState = lastState.current !== null;
        lastState.current = initialState;
        if (hadState) {
            setState(initialState);
        }
    }, [initialState]);

    useEffect(() => {
        if (loader === null || providedItems !== null) {
            return () => {};
        }
        const loadPromise = loadItems();
        return () => {
            if (loadPromise !== null) {
                loadPromise.cancel();
            }
        };
    }, [loader]);

    return {
        items,
        total,
        loaded,
        loading,
        reload: loadItems,
    };
}

export const useItemsPaginated = (
    loader,
    {
        page = null,
        count = 10,
        pages: initialPages = null,
        getPageFromResponse = ({
            pagination: { page: currentPage, last_page: lastPage, total },
            data: items,
        }) => ({
            page: parseInt(currentPage, 10),
            lastPage: parseInt(lastPage, 10),
            total: parseInt(total, 10),
            items,
        }),
        onLoaded = null,
        onError = null,
        query = null,
    } = {},
) => {
    const lastState = useRef(null);
    const initialState = useMemo(() => {
        const finalInitialPages =
            initialPages !== null ? initialPages.map((it) => getPageFromResponse(it)) : null;
        const finalLastPage =
            finalInitialPages !== null
                ? finalInitialPages.reduce(
                      (currentLastPage, { lastPage: initialLastPage }) =>
                          initialLastPage > currentLastPage ? initialLastPage : currentLastPage,
                      -1,
                  )
                : -1;
        return {
            lastPage: finalLastPage,
            total: finalInitialPages !== null ? finalInitialPages[0].total : 0,
            loaded:
                finalLastPage !== -1 &&
                finalInitialPages !== null &&
                finalInitialPages.length === finalLastPage,
            loading: false,
            pages: finalInitialPages !== null ? finalInitialPages : null,
        };
    }, [initialPages]);
    const currentPagesRef = useRef(initialState.pages);
    const [state, setState] = useState(initialState);
    const { lastPage, loaded, loading, pages, total } = state;
    const items =
        pages !== null
            ? pages.reduce((pagesItems, { items: pageItems }) => pagesItems.concat(pageItems), [])
            : null;
    const updateState = (update) => setState({ ...state, ...update });

    const updateFromResponse = (response, error = null, reset = false) => {
        if (error !== null) {
            updateState({
                loaded: false,
                loading: false,
            });
            throw error;
        }

        const newPage = getPageFromResponse(response);
        const currentPages = currentPagesRef.current || [];
        const newPages = (
            reset ? [newPage] : [...currentPages.filter((it) => it.page !== newPage.page), newPage]
        ).sort((a, b) => {
            const { page: aPage = null } = a;
            const { page: bPage = null } = b;

            const hasObject = aPage !== null && bPage !== null;

            if (hasObject) {
                if (aPage === bPage) {
                    return 0;
                }
                return aPage > bPage ? 1 : -1;
            }

            if (isNumber(a) && isNumber(b)) {
                if (a === b) {
                    return 0;
                }
                return a > b ? 1 : -1;
            }

            return 0;
        });

        currentPagesRef.current = newPages;
        updateState({
            loaded: true,
            loading: false,
            lastPage: newPage.lastPage,
            total: newPage.total,
            pages: newPages,
        });
        return newPage;
    };

    const getNextPage = () => {
        const allPages =
            lastPage !== -1
                ? Array.call(null, ...Array(lastPage)).map((it, index) => index + 1)
                : [];
        const currentPages = currentPagesRef.current || [];
        const remainingPages = allPages.filter(
            (pageNumber) => currentPages.findIndex((it) => it.page === pageNumber) === -1,
        );
        const firstItem = remainingPages.length > 0 ? remainingPages.shift() : null;
        return firstItem !== null ? firstItem : null;
    };

    const loadItems = (requestPage) => {
        updateState({
            loading: true,
        });

        return cancelable(loader(requestPage, count))
            .then((response) => updateFromResponse(response))
            .catch((error) => updateFromResponse(null, error))
            .then((response) => {
                if (onLoaded !== null) {
                    onLoaded(response);
                }
                return response;
            })
            .catch((error) => {
                if (onError !== null) {
                    onError(error);
                }
            });
    };

    const loadPage = (pageToLoad) => {
        if (loading) {
            return Promise.reject();
        }
        const currentPages = currentPagesRef.current || [];
        const foundPage = currentPages.find((it) => it.page === pageToLoad) || null;
        if (foundPage !== null) {
            return Promise.resolve(foundPage);
        }
        return loadItems(pageToLoad);
    };

    const loadNextPage = () => {
        if (loading) {
            return Promise.reject();
        }
        const nextPage = getNextPage();
        return nextPage !== null ? loadItems(nextPage) : Promise.resolve();
    };

    // Reset all on query change
    useEffect(() => {
        const hadState = lastState.current !== null;
        if (hadState) {
            currentPagesRef.current = null;
            updateState({
                loaded: true,
                loading: false,
                lastPage: null,
                total: 0,
                pages: [],
            });
        }
    }, [query]);

    useEffect(() => {
        const hadState = lastState.current !== null;
        lastState.current = initialState;
        if (hadState) {
            currentPagesRef.current = initialState.pages;
            setState(initialState);
        }
    }, [initialState]);

    useEffect(() => {
        if (loader === null) {
            return () => {};
        }
        let loadPromise = null;
        const pageToLoad = initialPages === null && page === null ? 1 : page;
        if (pageToLoad !== null) {
            loadPromise = loadItems(pageToLoad);
        }
        return () => {
            if (loadPromise !== null) {
                loadPromise.cancel();
            }
        };
    }, [loader, page]);

    const currentPage =
        pages !== null
            ? pages.find(
                  ({ page: pageNumber }) => parseInt(pageNumber, 10) === parseInt(page, 10),
              ) || null
            : null;

    return {
        items,
        pages,
        currentPage,
        pageItems: currentPage !== null ? currentPage.items : null,
        total,
        lastPage,
        loaded,
        allLoaded: lastPage !== -1 && pages.length === lastPage,
        loading,
        loadNextPage,
        loadPage,
    };
};
