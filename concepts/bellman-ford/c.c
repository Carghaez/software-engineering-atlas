// Bellman-Ford shortest paths (handles negative edges), via edge relaxation.
#include <assert.h>
#include <limits.h>

int main(void) {
    enum { V = 5, E = 10 };
    int edge[E][3] = {
        {0,1,6},{0,2,7},{1,2,8},{1,3,5},{1,4,-4},
        {2,3,-3},{2,4,9},{3,1,-2},{4,0,2},{4,3,7}};
    long dist[V];
    for (int i = 0; i < V; i++) dist[i] = LONG_MAX;
    dist[0] = 0;

    for (int it = 0; it < V - 1; it++)
        for (int e = 0; e < E; e++) {
            int u = edge[e][0], v = edge[e][1], w = edge[e][2];
            if (dist[u] != LONG_MAX && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
        }

    assert(dist[1] == 2 && dist[2] == 7 && dist[3] == 4 && dist[4] == -2);
    return 0;
}
