// Fenwick tree (Binary Indexed Tree): prefix sums + point updates.
#include <assert.h>

#define N 8
long bit[N + 1];                            // 1-indexed

void add(int i, long delta) {               // add at 0-indexed position i
    for (i++; i <= N; i += i & -i) bit[i] += delta;
}
long prefix(int i) {                        // sum of the first i elements [0, i)
    long s = 0;
    for (; i > 0; i -= i & -i) s += bit[i];
    return s;
}

int main(void) {
    int a[N] = {1, 2, 3, 4, 5, 6, 7, 8};
    for (int i = 0; i < N; i++) add(i, a[i]);
    assert(prefix(8) == 36);
    assert(prefix(5) - prefix(2) == 12);    // a[2..4] = 3 + 4 + 5
    add(2, 7);                               // a[2]: 3 -> 10
    assert(prefix(5) - prefix(2) == 19);
    return 0;
}
