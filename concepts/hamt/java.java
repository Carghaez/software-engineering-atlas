// HAMT: a persistent map; 5-bit hash chunks index a bitmap-compressed trie, sharing structure on update.
class Main {
    static class Node {
        boolean leaf; long key; int val; int bitmap; Node[] kids;
        static Node mkLeaf(long k, int v) { Node n = new Node(); n.leaf = true; n.key = k; n.val = v; return n; }
        static Node mkBranch(int bm, Node[] kids) { Node n = new Node(); n.bitmap = bm; n.kids = kids; return n; }
    }
    static int slot(long key, int shift) { return (int) ((key >> shift) & 31); }   // key doubles as its hash
    static int pos(int bm, int bit) { return Integer.bitCount(bm & (bit - 1)); }

    static Integer get(Node n, long key, int shift) {
        if (n.leaf) return n.key == key ? n.val : null;
        int bit = 1 << slot(key, shift);
        if ((n.bitmap & bit) == 0) return null;
        return get(n.kids[pos(n.bitmap, bit)], key, shift + 5);
    }
    static Node insert(Node n, long key, int val, int shift) {
        if (n.leaf) {
            if (n.key == key) return Node.mkLeaf(key, val);                       // replace
            return insert(insert(Node.mkBranch(0, new Node[0]), n.key, n.val, shift), key, val, shift);
        }
        int bit = 1 << slot(key, shift), p = pos(n.bitmap, bit);
        if ((n.bitmap & bit) == 0) {
            Node[] nk = new Node[n.kids.length + 1];
            System.arraycopy(n.kids, 0, nk, 0, p); nk[p] = Node.mkLeaf(key, val);
            System.arraycopy(n.kids, p, nk, p + 1, n.kids.length - p);
            return Node.mkBranch(n.bitmap | bit, nk);
        }
        Node[] kids = n.kids.clone();                                            // copy spine; subtrees shared
        kids[p] = insert(kids[p], key, val, shift + 5);
        return Node.mkBranch(n.bitmap, kids);
    }
    public static void main(String[] args) {
        Node v1 = insert(Node.mkBranch(0, new Node[0]), 10, 100, 0);
        Node v2 = insert(v1, 20, 200, 0);
        Node v3 = insert(v2, 10, 999, 0);   // update key 10
        assert get(v2, 10, 0) == 100 && get(v2, 20, 0) == 200;
        assert get(v3, 10, 0) == 999;       // new version sees the update
        assert get(v2, 10, 0) == 100;       // old version unchanged (persistence)
        assert get(v2, 30, 0) == null;
        System.out.println("ok");
    }
}
