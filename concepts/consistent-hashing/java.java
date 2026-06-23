// Consistent hashing over a TreeMap ring with virtual nodes.
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

class Main {
    static TreeMap<Integer, String> ring = new TreeMap<>();
    static int hash(String s) { return Math.floorMod(s.hashCode(), 1 << 16); }
    static void add(String node) { for (int i = 0; i < 50; i++) ring.put(hash(node + "#" + i), node); }
    static void remove(String node) { ring.values().removeIf(v -> v.equals(node)); }
    static String lookup(String key) {
        var e = ring.ceilingEntry(hash(key));
        return (e == null ? ring.firstEntry() : e).getValue();   // wrap clockwise
    }

    public static void main(String[] a) {
        add("A"); add("B"); add("C");
        String[] keys = {"apple","banana","cherry","date","egg","fig","grape","kiwi"};
        Map<String, String> before = new HashMap<>();
        for (String k : keys) before.put(k, lookup(k));
        assert before.get("apple").equals(lookup("apple"));      // deterministic

        remove("C");
        for (String k : keys) {
            String now = lookup(k);
            if (before.get(k).equals("C")) assert !now.equals("C");   // C's keys moved
            else assert now.equals(before.get(k));                    // others unchanged
        }
        System.out.println("ok");
    }
}
