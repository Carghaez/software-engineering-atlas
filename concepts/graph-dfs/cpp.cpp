// Recursive depth-first search over an adjacency list; records visit order.
#include <vector>
#include <cassert>

std::vector<std::vector<int>> g = {{1,2},{0,3},{0,3},{1,2,4},{3,5},{4}};
std::vector<bool> visited;
std::vector<int> order;

void dfs(int u) {
    visited[u] = true; order.push_back(u);
    for (int v : g[u]) if (!visited[v]) dfs(v);
}

int main() {
    visited.assign(g.size(), false);
    dfs(0);
    assert(order.size() == g.size());
    assert(order.front() == 0);
    for (bool b : visited) assert(b);
    return 0;
}
