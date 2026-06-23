// Kruskal's minimum spanning tree: sort edges, union endpoints, skip cycles.
#include <vector>
#include <array>
#include <algorithm>
#include <numeric>
#include <cassert>

int main() {
    int V = 4;
    std::vector<std::array<int, 3>> edges = {  // {weight, u, v}
        {10,0,1},{6,0,2},{5,0,3},{15,1,3},{4,2,3}};
    std::sort(edges.begin(), edges.end());      // by weight (first field)

    std::vector<int> parent(V);
    std::iota(parent.begin(), parent.end(), 0);
    auto find = [&](int x) { while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };

    int total = 0, used = 0;
    for (auto& e : edges) {
        int a = find(e[1]), b = find(e[2]);
        if (a != b) { parent[a] = b; total += e[0]; used++; }
    }

    assert(used == V - 1);      // a spanning tree
    assert(total == 19);        // 4 + 5 + 10
    return 0;
}
