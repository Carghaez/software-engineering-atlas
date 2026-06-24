// Approximation: greedy 2-approx Vertex Cover. Pick an uncovered edge, take BOTH ends -> cover <= 2*OPT.
#include <vector>
#include <set>
#include <utility>
#include <cassert>

int main() {
    // path 0-1-2-3-4: optimal cover is {1,3}, size 2
    std::vector<std::pair<int, int>> edges = {{0, 1}, {1, 2}, {2, 3}, {3, 4}};
    std::set<int> cover;
    for (auto [u, v] : edges)
        if (!cover.count(u) && !cover.count(v)) { cover.insert(u); cover.insert(v); }   // matched edge

    for (auto [u, v] : edges) assert(cover.count(u) || cover.count(v));   // every edge is covered
    int opt = 2;                              // known optimum for this path
    assert((int)cover.size() <= 2 * opt);     // 2-approximation guarantee holds
    assert((int)cover.size() >= opt);         // and never beats the optimum
    return 0;
}
