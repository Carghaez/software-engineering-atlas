// Strongly connected components via Kosaraju's two-pass DFS.
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Deque;
import java.util.List;

class Main {
    static int n = 5;
    static List<List<Integer>> g = new ArrayList<>(), gt = new ArrayList<>();
    static boolean[] vis;
    static int[] comp;
    static Deque<Integer> order = new ArrayDeque<>();

    static void dfs1(int u) { vis[u] = true; for (int v : g.get(u)) if (!vis[v]) dfs1(v); order.push(u); }
    static void dfs2(int u, int c) { comp[u] = c; for (int v : gt.get(u)) if (comp[v] < 0) dfs2(v, c); }

    public static void main(String[] a) {
        for (int i = 0; i < n; i++) { g.add(new ArrayList<>()); gt.add(new ArrayList<>()); }
        int[][] edges = {{1,0},{0,2},{2,1},{0,3},{3,4}};
        for (int[] e : edges) { g.get(e[0]).add(e[1]); gt.get(e[1]).add(e[0]); }

        vis = new boolean[n];
        for (int i = 0; i < n; i++) if (!vis[i]) dfs1(i);
        comp = new int[n]; Arrays.fill(comp, -1);
        int c = 0;
        while (!order.isEmpty()) { int u = order.pop(); if (comp[u] < 0) dfs2(u, c++); }

        assert c == 3;
        assert comp[0] == comp[1] && comp[1] == comp[2];
        assert comp[3] != comp[0] && comp[4] != comp[3];
        System.out.println(c);
    }
}
