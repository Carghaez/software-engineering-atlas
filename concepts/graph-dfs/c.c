// Recursive depth-first search over an adjacency matrix; records visit order.
#include <assert.h>

enum { N = 6 };
int adj[N][N], visited[N], order[N], idx;

void dfs(int u) {
    visited[u] = 1; order[idx++] = u;
    for (int v = 0; v < N; v++)
        if (adj[u][v] && !visited[v]) dfs(v);
}

int main(void) {
    int edges[][2] = {{0,1},{0,2},{1,3},{2,3},{3,4},{4,5}};
    for (int i = 0; i < 6; i++) { int u = edges[i][0], v = edges[i][1]; adj[u][v] = adj[v][u] = 1; }

    dfs(0);
    assert(idx == N);            // every vertex reached
    assert(order[0] == 0);       // started at the source
    for (int i = 0; i < N; i++) assert(visited[i]);
    return 0;
}
