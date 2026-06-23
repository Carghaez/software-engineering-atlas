// Breadth-first search over an adjacency matrix; computes hop distances.
#include <assert.h>

enum { N = 6 };

int main(void) {
    int adj[N][N] = {0};
    int edges[][2] = {{0,1},{0,2},{1,3},{2,3},{3,4},{4,5}};
    for (int i = 0; i < 6; i++) { int u = edges[i][0], v = edges[i][1]; adj[u][v] = adj[v][u] = 1; }

    int dist[N], queue[N], head = 0, tail = 0;
    for (int i = 0; i < N; i++) dist[i] = -1;
    dist[0] = 0; queue[tail++] = 0;
    while (head < tail) {
        int u = queue[head++];
        for (int v = 0; v < N; v++)
            if (adj[u][v] && dist[v] < 0) { dist[v] = dist[u] + 1; queue[tail++] = v; }
    }

    assert(dist[0] == 0 && dist[1] == 1 && dist[3] == 2 && dist[5] == 4);
    return 0;
}
