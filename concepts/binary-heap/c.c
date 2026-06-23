// Binary max-heap on an array: sift-up on insert, sift-down on extract.
#include <assert.h>
#include <stddef.h>

static void sift_up(int *h, size_t i) {
    while (i > 0) {
        size_t parent = (i - 1) / 2;
        if (h[parent] >= h[i]) break;
        int t = h[parent]; h[parent] = h[i]; h[i] = t;
        i = parent;
    }
}

static void sift_down(int *h, size_t n, size_t i) {
    for (;;) {
        size_t l = 2*i + 1, r = 2*i + 2, big = i;
        if (l < n && h[l] > h[big]) big = l;
        if (r < n && h[r] > h[big]) big = r;
        if (big == i) break;
        int t = h[big]; h[big] = h[i]; h[i] = t;
        i = big;
    }
}

int main(void) {
    int h[16]; size_t n = 0;
    int in[] = {3, 1, 4, 1, 5, 9, 2, 6};
    for (size_t k = 0; k < sizeof in / sizeof in[0]; k++) { h[n] = in[k]; sift_up(h, n); n++; }

    int prev = 1000;                       // extract-max yields descending order
    while (n > 0) {
        int top = h[0];
        assert(top <= prev); prev = top;
        h[0] = h[--n]; sift_down(h, n, 0);
    }
    assert(prev == 1);                     // the smallest came out last
    return 0;
}
