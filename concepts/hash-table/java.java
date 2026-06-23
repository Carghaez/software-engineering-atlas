// Idiomatic hash table in Java: HashMap (average O(1) get/put).
import java.util.HashMap;
import java.util.Map;

class Main {
    public static void main(String[] args) {
        Map<String, Integer> counts = new HashMap<>();

        // merge: insert 1, or combine with the existing value via Integer::sum.
        for (String w : new String[]{"a", "b", "a", "c", "a", "b"})
            counts.merge(w, 1, Integer::sum);

        assert counts.size() == 3;
        assert counts.get("a") == 3;
        assert counts.get("b") == 2;
        assert counts.get("z") == null;     // absent key
        System.out.println(counts);
    }
}
