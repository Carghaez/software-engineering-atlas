// Topological sort of a DAG via Kahn's algorithm (indegree + queue).
#include <assert.h>

enum { N = 6 };

int main(void) {
    int adj[N][N] = {0}, indeg[N] = {0};
    int edges[][2] = {{5,2},{5,0},{4,0},{4,1},{2,3},{3,1}};
    for (int i = 0; i < 6; i++) { int u = edges[i][0], v = edges[i][1]; adj[u][v] = 1; indeg[v]++; }

    int q[N], h = 0, t = 0, pos[N], k = 0;
    for (int i = 0; i < N; i++) if (indeg[i] == 0) q[t++] = i;
    while (h < t) {
        int u = q[h++]; pos[u] = k++;
        for (int v = 0; v < N; v++) if (adj[u][v] && --indeg[v] == 0) q[t++] = v;
    }

    assert(k == N);                                       // acyclic: all emitted
    for (int i = 0; i < 6; i++) assert(pos[edges[i][0]] < pos[edges[i][1]]);  // u before v
    return 0;
}
