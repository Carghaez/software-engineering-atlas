// Dijkstra's shortest paths from a source on a non-negative weighted graph.
#include <vector>
#include <queue>
#include <utility>
#include <climits>
#include <cassert>

int main() {
    // adjacency list: g[u] = { (v, weight), ... }
    std::vector<std::vector<std::pair<int,int>>> g = {
        {{1, 4}, {2, 1}},   // 0
        {{3, 1}},           // 1
        {{1, 2}, {3, 5}},   // 2
        {},                 // 3
    };
    int n = (int)g.size(), src = 0;
    std::vector<int> dist(n, INT_MAX);
    dist[src] = 0;

    using Node = std::pair<int,int>;        // (distance, vertex)
    std::priority_queue<Node, std::vector<Node>, std::greater<>> pq;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;          // stale entry
        for (auto [v, w] : g[u])
            if (d + w < dist[v]) { dist[v] = d + w; pq.push({dist[v], v}); }
    }

    assert(dist[0] == 0 && dist[2] == 1 && dist[1] == 3 && dist[3] == 4);
    return 0;
}
