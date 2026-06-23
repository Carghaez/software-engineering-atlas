// Bloom filter: k=2 hashes over a bit set; no false negatives.
import java.util.BitSet;

class Main {
    static final int M = 1024;
    static BitSet bits = new BitSet(M);

    static int h(String s, int salt) { return Math.floorMod((s + salt).hashCode(), M); }
    static void add(String s) { bits.set(h(s, 0)); bits.set(h(s, 1)); }
    static boolean maybe(String s) { return bits.get(h(s, 0)) && bits.get(h(s, 1)); }

    public static void main(String[] args) {
        add("apple"); add("banana");
        assert maybe("apple");       // no false negatives
        assert maybe("banana");
        assert !maybe("cherry");     // true negative (no collision here)
        System.out.println("ok");
    }
}
