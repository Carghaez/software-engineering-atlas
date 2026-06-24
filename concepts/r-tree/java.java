// R-tree: data rectangles grouped under minimum bounding rectangles; a window query skips non-overlapping MBRs.
import java.util.*;

class Main {
    static int probes = 0;
    record Rect(float x0, float y0, float x1, float y1) {}
    record Entry(Rect box, int id) {}
    record Node(Rect mbr, Entry[] entries) {}

    static boolean overlap(Rect a, Rect b) {
        return a.x0() <= b.x1() && b.x0() <= a.x1() && a.y0() <= b.y1() && b.y0() <= a.y1();
    }
    static List<Integer> query(Node[] tree, Rect w) {
        List<Integer> hits = new ArrayList<>();
        for (Node n : tree) {
            if (!overlap(n.mbr(), w)) continue;          // prune the whole node by its MBR
            for (Entry e : n.entries()) { probes++; if (overlap(e.box(), w)) hits.add(e.id()); }
        }
        return hits;
    }
    public static void main(String[] args) {
        Node[] tree = {
            new Node(new Rect(0, 0, 3, 3), new Entry[]{new Entry(new Rect(0, 0, 1, 1), 0), new Entry(new Rect(2, 2, 3, 3), 1)}),
            new Node(new Rect(5, 5, 8, 8), new Entry[]{new Entry(new Rect(5, 5, 6, 6), 2), new Entry(new Rect(7, 7, 8, 8), 3)}),
        };
        List<Integer> hits = query(tree, new Rect(0.5f, 0.5f, 2.5f, 2.5f));   // window near the origin
        assert hits.equals(List.of(0, 1));
        assert probes == 2;     // only the left node's entries probed; right MBR pruned
        System.out.println("ok");
    }
}
