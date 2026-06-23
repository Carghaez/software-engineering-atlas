// Sparse set of small integers: O(1) insert / remove / membership.
#include <vector>
#include <cassert>

struct SparseSet {
    std::vector<int> dense, sparse;
    int n = 0;
    explicit SparseSet(int cap) : dense(cap, 0), sparse(cap, 0) {}
    bool contains(int x) const { int i = sparse[x]; return i < n && dense[i] == x; }
    void insert(int x) { if (contains(x)) return; sparse[x] = n; dense[n++] = x; }
    void erase(int x) {
        if (!contains(x)) return;
        int i = sparse[x], last = dense[--n];
        dense[i] = last; sparse[last] = i;
    }
};

int main() {
    SparseSet s(100);
    s.insert(5); s.insert(42); s.insert(5); s.insert(7);
    assert(s.n == 3);
    assert(s.contains(42) && !s.contains(8));
    s.erase(42);
    assert(!s.contains(42) && s.contains(5) && s.contains(7));
    return 0;
}
