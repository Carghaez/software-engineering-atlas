// Iterative segment tree: range-sum query + point update.
#include <assert.h>

#define N 8
long seg[2 * N];

void build(const int *a) {
    for (int i = 0; i < N; i++) seg[N + i] = a[i];
    for (int i = N - 1; i > 0; i--) seg[i] = seg[2 * i] + seg[2 * i + 1];
}
void update(int pos, long val) {
    for (seg[pos += N] = val, pos /= 2; pos >= 1; pos /= 2)
        seg[pos] = seg[2 * pos] + seg[2 * pos + 1];
}
long query(int l, int r) {                 // sum over [l, r)
    long s = 0;
    for (l += N, r += N; l < r; l /= 2, r /= 2) {
        if (l & 1) s += seg[l++];
        if (r & 1) s += seg[--r];
    }
    return s;
}

int main(void) {
    int a[N] = {1, 2, 3, 4, 5, 6, 7, 8};
    build(a);
    assert(query(0, 8) == 36);
    assert(query(2, 5) == 12);             // 3 + 4 + 5
    update(2, 10);                          // a[2]: 3 -> 10
    assert(query(2, 5) == 19);             // 10 + 4 + 5
    return 0;
}
