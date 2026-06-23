// Quicksort (Lomuto partition), in place, on an int array.
#include <assert.h>
#include <stddef.h>

static void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

static void quicksort(int *a, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = a[hi], i = lo;              // last element as pivot
    for (int j = lo; j < hi; j++)
        if (a[j] < pivot) swap(&a[i++], &a[j]);
    swap(&a[i], &a[hi]);                    // pivot to its sorted position
    quicksort(a, lo, i - 1);
    quicksort(a, i + 1, hi);
}

int main(void) {
    int a[] = {5, 2, 9, 1, 5, 6, 3, 8, 7, 0};
    int n = (int)(sizeof a / sizeof a[0]);
    quicksort(a, 0, n - 1);
    for (int k = 1; k < n; k++) assert(a[k - 1] <= a[k]);
    assert(a[0] == 0 && a[n - 1] == 9);
    return 0;
}
