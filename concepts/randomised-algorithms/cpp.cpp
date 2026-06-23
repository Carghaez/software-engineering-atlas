// Randomised quickselect: random pivot (xorshift) -> O(n) expected k-th smallest.
#include <vector>
#include <cassert>

static unsigned long rng = 88172645463325252UL;
unsigned long rnd() { rng ^= rng << 13; rng ^= rng >> 7; rng ^= rng << 17; return rng; }

int quickselect(std::vector<int> a, int k) {     // by value: caller's data untouched
    int lo = 0, hi = (int)a.size() - 1;
    while (lo < hi) {
        int pi = lo + (int)(rnd() % (unsigned)(hi - lo + 1));
        std::swap(a[pi], a[hi]);
        int store = lo;
        for (int i = lo; i < hi; i++) if (a[i] < a[hi]) std::swap(a[i], a[store++]);
        std::swap(a[store], a[hi]);
        if (store == k) return a[store];
        if (store < k) lo = store + 1; else hi = store - 1;
    }
    return a[lo];
}

int main() {
    std::vector<int> v{7,2,9,1,5,6,3,8,4,0};
    assert(quickselect(v, 0) == 0);
    assert(quickselect(v, 9) == 9);
    assert(quickselect(v, 5) == 5);
    return 0;
}
