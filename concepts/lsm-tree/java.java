// LSM-tree: writes hit an in-memory memtable; flushes make immutable sorted runs; reads scan newest-first.
import java.util.*;

class Main {
    static TreeMap<String, Integer> memtable = new TreeMap<>();
    static List<TreeMap<String, Integer>> sstables = new ArrayList<>();   // index 0 = newest run

    static void put(String k, int v) { memtable.put(k, v); }
    static void flush() { sstables.add(0, new TreeMap<>(memtable)); memtable.clear(); }
    static Integer get(String k) {
        if (memtable.containsKey(k)) return memtable.get(k);   // memtable shadows older runs
        for (TreeMap<String, Integer> ss : sstables) if (ss.containsKey(k)) return ss.get(k);
        return null;
    }
    public static void main(String[] args) {
        put("a", 1); put("b", 2);
        flush();                  // -> SSTable {a:1, b:2}
        put("a", 99);             // newer write, still in the memtable
        assert get("a") == 99;    // newer memtable value shadows the old SSTable
        assert get("b") == 2;     // served from the flushed SSTable
        assert get("z") == null;  // absent in every run
        System.out.println("ok");
    }
}
