// A* shortest path on a 4-connected grid (Manhattan heuristic).
int[][] grid = {
    new[]{0,0,0,0,0}, new[]{1,1,1,1,0}, new[]{0,0,0,0,0}, new[]{0,1,1,1,1}, new[]{0,0,0,0,0}
};
int R = 5, C = 5, gr = 4, gc = 0;
int H(int r, int c) => Math.Abs(r - gr) + Math.Abs(c - gc);

var g = new int[R, C];
for (int i = 0; i < R; i++) for (int j = 0; j < C; j++) g[i, j] = int.MaxValue;
var pq = new PriorityQueue<(int r, int c), int>();
g[0, 0] = 0; pq.Enqueue((0, 0), H(0, 0));
int[] dr = { -1, 1, 0, 0 }, dc = { 0, 0, -1, 1 };
int ans = -1;
while (pq.Count > 0)
{
    var (r, c) = pq.Dequeue();
    if (r == gr && c == gc) { ans = g[r, c]; break; }   // first goal pop is optimal
    for (int d = 0; d < 4; d++)
    {
        int nr = r + dr[d], nc = c + dc[d];
        if (nr < 0 || nr >= R || nc < 0 || nc >= C || grid[nr][nc] == 1) continue;
        int ng = g[r, c] + 1;
        if (ng < g[nr, nc]) { g[nr, nc] = ng; pq.Enqueue((nr, nc), ng + H(nr, nc)); }
    }
}

Check(ans == 12, "shortest path cost");

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
