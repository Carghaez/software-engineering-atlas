// Breadth-first search over an adjacency list; computes hop distances.
#include <vector>
#include <queue>
#include <cassert>

int main() {
    std::vector<std::vector<int>> g = {{1,2},{0,3},{0,3},{1,2,4},{3,5},{4}};
    std::vector<int> dist(g.size(), -1);
    std::queue<int> q;
    dist[0] = 0; q.push(0);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : g[u]) if (dist[v] < 0) { dist[v] = dist[u] + 1; q.push(v); }
    }

    assert(dist[0] == 0 && dist[3] == 2 && dist[5] == 4);
    return 0;
}
