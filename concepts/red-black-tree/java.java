// A red-black tree in Java is TreeMap (sorted, navigable map).
import java.util.ArrayList;
import java.util.List;
import java.util.TreeMap;

class Main {
    public static void main(String[] args) {
        TreeMap<Integer, String> m = new TreeMap<>();
        m.put(5, "e"); m.put(1, "a"); m.put(3, "c"); m.put(2, "b"); m.put(4, "d");

        List<Integer> keys = new ArrayList<>(m.keySet());   // ascending order
        assert keys.equals(List.of(1, 2, 3, 4, 5));
        assert m.get(3).equals("c");
        assert m.firstKey() == 1 && m.lastKey() == 5;       // O(log n) navigation
        System.out.println(keys);
    }
}
