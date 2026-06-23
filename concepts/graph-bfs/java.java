// Breadth-first search over an adjacency list; computes hop distances.
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

class Main {
    public static void main(String[] args) {
        int[][] g = {{1,2},{0,3},{0,3},{1,2,4},{3,5},{4}};
        int[] dist = new int[g.length];
        Arrays.fill(dist, -1);

        Deque<Integer> q = new ArrayDeque<>();
        dist[0] = 0; q.add(0);
        while (!q.isEmpty()) {
            int u = q.remove();
            for (int v : g[u]) if (dist[v] < 0) { dist[v] = dist[u] + 1; q.add(v); }
        }

        assert dist[0] == 0 && dist[3] == 2 && dist[5] == 4;
        System.out.println(Arrays.toString(dist));
    }
}
