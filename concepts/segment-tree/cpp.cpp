// Iterative segment tree: range-sum query + point update.
#include <vector>
#include <cassert>

struct SegTree {
    int n;
    std::vector<long> seg;
    explicit SegTree(const std::vector<int>& a) : n((int)a.size()), seg(2 * a.size()) {
        for (int i = 0; i < n; i++) seg[n + i] = a[i];
        for (int i = n - 1; i > 0; i--) seg[i] = seg[2 * i] + seg[2 * i + 1];
    }
    void update(int pos, long val) {
        for (seg[pos += n] = val, pos /= 2; pos >= 1; pos /= 2)
            seg[pos] = seg[2 * pos] + seg[2 * pos + 1];
    }
    long query(int l, int r) {             // sum over [l, r)
        long s = 0;
        for (l += n, r += n; l < r; l /= 2, r /= 2) {
            if (l & 1) s += seg[l++];
            if (r & 1) s += seg[--r];
        }
        return s;
    }
};

int main() {
    SegTree t({1, 2, 3, 4, 5, 6, 7, 8});
    assert(t.query(0, 8) == 36);
    assert(t.query(2, 5) == 12);
    t.update(2, 10);
    assert(t.query(2, 5) == 19);
    return 0;
}
