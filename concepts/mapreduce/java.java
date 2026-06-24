// MapReduce: map emits (key,1) pairs, shuffle groups by key, reduce sums them -> word count.
import java.util.*;

class Main {
    public static void main(String[] args) {
        String[] docs = {"a b a", "b c", "a c c"};

        // MAP + SHUFFLE: each word -> (word, 1), grouped by key
        Map<String, List<Integer>> shuffled = new TreeMap<>();
        for (String doc : docs)
            for (String w : doc.split(" "))
                shuffled.computeIfAbsent(w, k -> new ArrayList<>()).add(1);

        // REDUCE: sum the ones for each key
        Map<String, Integer> counts = new TreeMap<>();
        for (var e : shuffled.entrySet())
            counts.put(e.getKey(), e.getValue().stream().mapToInt(Integer::intValue).sum());

        assert counts.equals(Map.of("a", 3, "b", 2, "c", 3));   // a:3, b:2, c:3
        System.out.println("ok");
    }
}
