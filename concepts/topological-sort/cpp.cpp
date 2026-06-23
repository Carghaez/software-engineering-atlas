// Topological sort of a DAG via Kahn's algorithm (indegree + queue).
#include <vector>
#include <queue>
#include <cassert>

int main() {
    std::vector<std::vector<int>> g(6);
    int edges[][2] = {{5,2},{5,0},{4,0},{4,1},{2,3},{3,1}};
    std::vector<int> indeg(6, 0);
    for (auto& e : edges) { g[e[0]].push_back(e[1]); indeg[e[1]]++; }

    std::queue<int> q;
    for (int i = 0; i < 6; i++) if (indeg[i] == 0) q.push(i);
    std::vector<int> pos(6, -1); int k = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop(); pos[u] = k++;
        for (int v : g[u]) if (--indeg[v] == 0) q.push(v);
    }

    assert(k == 6);                                          // acyclic: all emitted
    for (auto& e : edges) assert(pos[e[0]] < pos[e[1]]);     // u before v
    return 0;
}
