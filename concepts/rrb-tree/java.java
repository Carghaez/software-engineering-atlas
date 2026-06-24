// RRB-style persistent vector: a radix-balanced trie; update copies only the path and shares the rest.
class Main {
    static final int B = 4;   // branching factor (real RRB uses 32, plus "relaxed" nodes for O(log n) concat)

    static class PVec {
        int[][] root;   // height-2 trie: a spine of B leaf blocks, each B ints
        PVec(int[][] r) { root = r; }
        static PVec empty() {
            int[][] r = new int[B][];
            for (int i = 0; i < B; i++) r[i] = new int[B];
            return new PVec(r);
        }
        int get(int i) { return root[i / B][i % B]; }
        PVec update(int i, int v) {
            int[][] r = root.clone();          // copy the spine (B references)
            int[] leaf = r[i / B].clone();     // copy only the touched leaf block
            leaf[i % B] = v;
            r[i / B] = leaf;
            return new PVec(r);
        }
    }
    public static void main(String[] args) {
        PVec v0 = PVec.empty();
        PVec v1 = v0.update(5, 50);
        PVec v2 = v1.update(10, 100);
        assert v1.get(5) == 50;
        assert v2.get(10) == 100;
        assert v2.get(5) == 50;             // v1's update visible through v2 (shared leaf)
        assert v0.get(5) == 0;              // v0 unchanged (persistence)
        assert v1.root[0] == v2.root[0];    // untouched leaf block is shared by reference
        System.out.println("ok");
    }
}
