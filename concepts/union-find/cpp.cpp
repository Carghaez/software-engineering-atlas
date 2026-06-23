// Disjoint-set (union-find) with path compression and union by rank.
#include <vector>
#include <numeric>
#include <cassert>

struct DSU {
    std::vector<int> parent, rank_;
    explicit DSU(int n) : parent(n), rank_(n, 0) { std::iota(parent.begin(), parent.end(), 0); }
    int find(int x) {
        while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
    }
    void unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return;
        if (rank_[a] < rank_[b]) std::swap(a, b);
        parent[b] = a;
        if (rank_[a] == rank_[b]) rank_[a]++;
    }
};

int main() {
    DSU d(10);
    d.unite(0, 1); d.unite(1, 2); d.unite(3, 4);
    assert(d.find(0) == d.find(2));
    assert(d.find(0) != d.find(3));
    d.unite(2, 3);
    assert(d.find(0) == d.find(4));     // all connected
    return 0;
}
