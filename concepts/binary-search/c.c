// Iterative binary search over a sorted array. Returns the index, or -1.
#include <assert.h>
#include <stddef.h>

int binary_search(const int *a, size_t n, int key) {
    size_t lo = 0, hi = n;                  // half-open interval [lo, hi)
    while (lo < hi) {
        size_t mid = lo + (hi - lo) / 2;    // midpoint without overflow
        if (a[mid] == key) return (int)mid;
        if (a[mid] < key) lo = mid + 1;
        else hi = mid;
    }
    return -1;
}

int main(void) {
    int a[] = {1, 3, 4, 7, 9, 11, 15};
    size_t n = sizeof a / sizeof a[0];
    assert(binary_search(a, n, 7) == 3);
    assert(binary_search(a, n, 1) == 0);
    assert(binary_search(a, n, 15) == 6);
    assert(binary_search(a, n, 8) == -1);   // absent
    return 0;
}
