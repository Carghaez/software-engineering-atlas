// A* shortest path on a 4-connected grid (Manhattan heuristic).
#include <assert.h>

#define R 5
#define C 5
static int grid[R][C] = {
    {0,0,0,0,0},
    {1,1,1,1,0},
    {0,0,0,0,0},
    {0,1,1,1,1},
    {0,0,0,0,0}};

static int habs(int x) { return x < 0 ? -x : x; }

int astar(int sr, int sc, int gr, int gc) {
    int g[R][C], f[R][C], done[R][C];
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++) { g[i][j] = f[i][j] = 1 << 30; done[i][j] = 0; }
    int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1};
    g[sr][sc] = 0; f[sr][sc] = habs(sr - gr) + habs(sc - gc);
    for (;;) {
        int br = -1, bc = -1, best = 1 << 30;
        for (int i = 0; i < R; i++)
            for (int j = 0; j < C; j++)
                if (!done[i][j] && f[i][j] < best) { best = f[i][j]; br = i; bc = j; }
        if (br < 0) return -1;                       // open set empty
        if (br == gr && bc == gc) return g[br][bc];
        done[br][bc] = 1;
        for (int d = 0; d < 4; d++) {
            int nr = br + dr[d], nc = bc + dc[d];
            if (nr < 0 || nr >= R || nc < 0 || nc >= C || grid[nr][nc] || done[nr][nc]) continue;
            int ng = g[br][bc] + 1;
            if (ng < g[nr][nc]) { g[nr][nc] = ng; f[nr][nc] = ng + habs(nr - gr) + habs(nc - gc); }
        }
    }
}

int main(void) {
    assert(astar(0, 0, 4, 0) == 12);     // walls force a detour (Manhattan = 4)
    return 0;
}
