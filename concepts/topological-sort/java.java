// Topological sort of a DAG via Kahn's algorithm (indegree + queue).
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

class Main {
    public static void main(String[] args) {
        int n = 6;
        List<List<Integer>> g = new ArrayList<>();
        for (int i = 0; i < n; i++) g.add(new ArrayList<>());
        int[][] edges = {{5,2},{5,0},{4,0},{4,1},{2,3},{3,1}};
        int[] indeg = new int[n];
        for (int[] e : edges) { g.get(e[0]).add(e[1]); indeg[e[1]]++; }

        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);
        int[] pos = new int[n]; int k = 0;
        while (!q.isEmpty()) {
            int u = q.remove(); pos[u] = k++;
            for (int v : g.get(u)) if (--indeg[v] == 0) q.add(v);
        }

        assert k == n;                                       // acyclic: all emitted
        for (int[] e : edges) assert pos[e[0]] < pos[e[1]];  // u before v
        System.out.println("ok");
    }
}
