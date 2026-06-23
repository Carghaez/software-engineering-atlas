// Fenwick tree (Binary Indexed Tree): prefix sums + point updates.
#include <vector>
#include <cassert>

struct Fenwick {
    std::vector<long> bit;                   // 1-indexed
    explicit Fenwick(int n) : bit(n + 1, 0) {}
    void add(int i, long delta) {            // add at 0-indexed position i
        for (++i; i < (int)bit.size(); i += i & -i) bit[i] += delta;
    }
    long prefix(int i) {                     // sum of the first i elements [0, i)
        long s = 0;
        for (; i > 0; i -= i & -i) s += bit[i];
        return s;
    }
};

int main() {
    int a[] = {1, 2, 3, 4, 5, 6, 7, 8};
    Fenwick f(8);
    for (int i = 0; i < 8; i++) f.add(i, a[i]);
    assert(f.prefix(8) == 36);
    assert(f.prefix(5) - f.prefix(2) == 12);
    f.add(2, 7);
    assert(f.prefix(5) - f.prefix(2) == 19);
    return 0;
}
