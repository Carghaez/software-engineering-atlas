// Recursive depth-first search over an adjacency list; records visit order.
import java.util.ArrayList;
import java.util.List;

class Main {
    static int[][] g = {{1,2},{0,3},{0,3},{1,2,4},{3,5},{4}};
    static boolean[] visited;
    static List<Integer> order = new ArrayList<>();

    static void dfs(int u) {
        visited[u] = true; order.add(u);
        for (int v : g[u]) if (!visited[v]) dfs(v);
    }

    public static void main(String[] args) {
        visited = new boolean[g.length];
        dfs(0);
        assert order.size() == g.length;
        assert order.get(0) == 0;
        for (boolean b : visited) assert b;
        System.out.println(order);
    }
}
