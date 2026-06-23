// Bellman-Ford shortest paths (handles negative edges), via edge relaxation.
#include <vector>
#include <array>
#include <climits>
#include <cassert>

int main() {
    int V = 5;
    std::vector<std::array<long, 3>> edges = {  // {u, v, weight}
        {0,1,6},{0,2,7},{1,2,8},{1,3,5},{1,4,-4},
        {2,3,-3},{2,4,9},{3,1,-2},{4,0,2},{4,3,7}};
    std::vector<long> dist(V, LONG_MAX);
    dist[0] = 0;

    for (int it = 0; it < V - 1; ++it)
        for (auto& e : edges) {
            long u = e[0], v = e[1], w = e[2];
            if (dist[u] != LONG_MAX && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
        }

    assert(dist[1] == 2 && dist[2] == 7 && dist[3] == 4 && dist[4] == -2);
    return 0;
}
