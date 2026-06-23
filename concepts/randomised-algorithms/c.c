// Randomised quickselect: random pivot (xorshift) -> O(n) expected k-th smallest.
#include <assert.h>

static unsigned long rng = 88172645463325252UL;
static unsigned long rnd(void) { rng ^= rng << 13; rng ^= rng >> 7; rng ^= rng << 17; return rng; }
static void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

int quickselect(int *a, int n, int k) {          // k-th smallest, 0-indexed
    int lo = 0, hi = n - 1;
    while (lo < hi) {
        int pi = lo + (int)(rnd() % (unsigned)(hi - lo + 1));
        swap(&a[pi], &a[hi]);                     // random pivot to the end
        int store = lo;
        for (int i = lo; i < hi; i++) if (a[i] < a[hi]) swap(&a[i], &a[store++]);
        swap(&a[store], &a[hi]);                  // pivot to its sorted position
        if (store == k) return a[store];
        if (store < k) lo = store + 1; else hi = store - 1;
    }
    return a[lo];
}

int main(void) {
    int a[] = {7,2,9,1,5,6,3,8,4,0}, b[] = {7,2,9,1,5,6,3,8,4,0}, c[] = {7,2,9,1,5,6,3,8,4,0};
    assert(quickselect(a, 10, 0) == 0);          // a permutation of 0..9, so
    assert(quickselect(b, 10, 9) == 9);          // the k-th smallest value is k
    assert(quickselect(c, 10, 5) == 5);
    return 0;
}
