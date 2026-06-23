// A* shortest path on a 4-connected grid (Manhattan heuristic).
import java.util.Arrays;
import java.util.PriorityQueue;

class Main {
    public static void main(String[] args) {
        int[][] grid = {{0,0,0,0,0}, {1,1,1,1,0}, {0,0,0,0,0}, {0,1,1,1,1}, {0,0,0,0,0}};
        int R = 5, C = 5, gr = 4, gc = 0;
        int[][] g = new int[R][C];
        for (int[] row : g) Arrays.fill(row, Integer.MAX_VALUE);

        // queue entries are {f, r, c}, ordered by f = g + heuristic
        PriorityQueue<int[]> pq = new PriorityQueue<>((x, y) -> Integer.compare(x[0], y[0]));
        g[0][0] = 0; pq.add(new int[]{gr + gc, 0, 0});
        int[] dr = {-1, 1, 0, 0}, dc = {0, 0, -1, 1}, ans = {-1};
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int r = cur[1], c = cur[2];
            if (r == gr && c == gc) { ans[0] = g[r][c]; break; }
            for (int d = 0; d < 4; d++) {
                int nr = r + dr[d], nc = c + dc[d];
                if (nr < 0 || nr >= R || nc < 0 || nc >= C || grid[nr][nc] == 1) continue;
                int ng = g[r][c] + 1;
                if (ng < g[nr][nc]) {
                    g[nr][nc] = ng;
                    pq.add(new int[]{ng + Math.abs(nr - gr) + Math.abs(nc - gc), nr, nc});
                }
            }
        }
        assert ans[0] == 12;
        System.out.println(ans[0]);
    }
}
