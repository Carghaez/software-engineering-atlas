// Strongly connected components via Kosaraju's two-pass DFS.
#include <vector>
#include <cassert>

int n = 5;
std::vector<std::vector<int>> g, gt;
std::vector<bool> vis;
std::vector<int> comp, order;

void dfs1(int u) { vis[u] = true; for (int v : g[u]) if (!vis[v]) dfs1(v); order.push_back(u); }
void dfs2(int u, int c) { comp[u] = c; for (int v : gt[u]) if (comp[v] < 0) dfs2(v, c); }

int main() {
    g.assign(n, {}); gt.assign(n, {});
    int edges[][2] = {{1,0},{0,2},{2,1},{0,3},{3,4}};
    for (auto& e : edges) { g[e[0]].push_back(e[1]); gt[e[1]].push_back(e[0]); }

    vis.assign(n, false);
    for (int i = 0; i < n; i++) if (!vis[i]) dfs1(i);
    comp.assign(n, -1);
    int c = 0;
    for (int i = n - 1; i >= 0; i--) if (comp[order[i]] < 0) dfs2(order[i], c++);

    assert(c == 3);                                       // {0,1,2}, {3}, {4}
    assert(comp[0] == comp[1] && comp[1] == comp[2]);
    assert(comp[3] != comp[0] && comp[4] != comp[3]);
    return 0;
}
