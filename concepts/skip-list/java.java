// A skip list in Java's standard library: ConcurrentSkipListMap (sorted, O(log n)).
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentSkipListMap;

class Main {
    public static void main(String[] args) {
        ConcurrentSkipListMap<Integer, String> m = new ConcurrentSkipListMap<>();
        m.put(5, "e"); m.put(1, "a"); m.put(3, "c"); m.put(2, "b"); m.put(4, "d");

        List<Integer> keys = new ArrayList<>(m.keySet());   // randomized levels, ordered API
        assert keys.equals(List.of(1, 2, 3, 4, 5));
        assert m.firstKey() == 1 && m.lastKey() == 5;
        assert m.ceilingKey(3) == 3 && m.higherKey(3) == 4; // navigable queries
        System.out.println(keys);
    }
}
