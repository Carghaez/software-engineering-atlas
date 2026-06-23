// A* shortest path on a 4-connected grid (Manhattan heuristic).
#include <vector>
#include <queue>
#include <tuple>
#include <cstdlib>
#include <cassert>

int main() {
    std::vector<std::vector<int>> grid = {
        {0,0,0,0,0}, {1,1,1,1,0}, {0,0,0,0,0}, {0,1,1,1,1}, {0,0,0,0,0}};
    int R = 5, C = 5, gr = 4, gc = 0;
    auto h = [&](int r, int c) { return std::abs(r - gr) + std::abs(c - gc); };

    std::vector<std::vector<int>> g(R, std::vector<int>(C, 1 << 30));
    using St = std::tuple<int, int, int>;            // (f, r, c)
    std::priority_queue<St, std::vector<St>, std::greater<>> pq;
    g[0][0] = 0; pq.push({h(0, 0), 0, 0});
    int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1}, ans = -1;
    while (!pq.empty()) {
        auto [f, r, c] = pq.top(); pq.pop();
        if (f > g[r][c] + h(r, c)) continue;         // stale queue entry
        if (r == gr && c == gc) { ans = g[r][c]; break; }
        for (int d = 0; d < 4; d++) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr < 0 || nr >= R || nc < 0 || nc >= C || grid[nr][nc]) continue;
            int ng = g[r][c] + 1;
            if (ng < g[nr][nc]) { g[nr][nc] = ng; pq.push({ng + h(nr, nc), nr, nc}); }
        }
    }
    assert(ans == 12);
    return 0;
}
