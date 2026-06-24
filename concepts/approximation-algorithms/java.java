// Approximation: greedy 2-approx Vertex Cover. Pick an uncovered edge, take BOTH ends -> cover <= 2*OPT.
import java.util.*;

class Main {
    public static void main(String[] args) {
        int[][] edges = {{0, 1}, {1, 2}, {2, 3}, {3, 4}};   // path; optimal cover {1,3} has size 2
        Set<Integer> cover = new HashSet<>();
        for (int[] e : edges)
            if (!cover.contains(e[0]) && !cover.contains(e[1])) { cover.add(e[0]); cover.add(e[1]); }

        for (int[] e : edges) assert cover.contains(e[0]) || cover.contains(e[1]);   // every edge covered
        int opt = 2;                       // known optimum for this path
        assert cover.size() <= 2 * opt;    // 2-approximation guarantee holds
        assert cover.size() >= opt;        // and never beats the optimum
        System.out.println("ok");
    }
}
