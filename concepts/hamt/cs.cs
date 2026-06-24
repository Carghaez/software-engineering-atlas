// HAMT: a persistent map; 5-bit hash chunks index a bitmap-compressed trie, sharing structure on update.
int Slot(long key, int shift) => (int)((key >> shift) & 31);   // key doubles as its hash
int Pos(int bm, int bit) => System.Numerics.BitOperations.PopCount((uint)(bm & (bit - 1)));

int? Get(Node n, long key, int shift)
{
    if (n.Leaf) return n.Key == key ? n.Val : (int?)null;
    int bit = 1 << Slot(key, shift);
    if ((n.Bitmap & bit) == 0) return null;
    return Get(n.Kids[Pos(n.Bitmap, bit)], key, shift + 5);
}
Node Insert(Node n, long key, int val, int shift)
{
    if (n.Leaf)
    {
        if (n.Key == key) return Node.MkLeaf(key, val);                          // replace
        return Insert(Insert(Node.MkBranch(0, new Node[0]), n.Key, n.Val, shift), key, val, shift);
    }
    int bit = 1 << Slot(key, shift), p = Pos(n.Bitmap, bit);
    if ((n.Bitmap & bit) == 0)
    {
        var nk = new Node[n.Kids.Length + 1];
        Array.Copy(n.Kids, 0, nk, 0, p); nk[p] = Node.MkLeaf(key, val);
        Array.Copy(n.Kids, p, nk, p + 1, n.Kids.Length - p);
        return Node.MkBranch(n.Bitmap | bit, nk);
    }
    var kids = (Node[])n.Kids.Clone();                                           // copy spine; subtrees shared
    kids[p] = Insert(kids[p], key, val, shift + 5);
    return Node.MkBranch(n.Bitmap, kids);
}

Node v1 = Insert(Node.MkBranch(0, new Node[0]), 10, 100, 0);
Node v2 = Insert(v1, 20, 200, 0);
Node v3 = Insert(v2, 10, 999, 0);   // update key 10
Check(Get(v2, 10, 0) == 100 && Get(v2, 20, 0) == 200, "v2");
Check(Get(v3, 10, 0) == 999, "v3-update");      // new version sees the update
Check(Get(v2, 10, 0) == 100, "v2-persisted");   // old version unchanged (persistence)
Check(Get(v2, 30, 0) == null, "absent");

static void Check(bool ok, string msg) { if (!ok) throw new Exception($"assertion failed: {msg}"); }

class Node
{
    public bool Leaf; public long Key; public int Val; public int Bitmap; public Node[] Kids;
    public static Node MkLeaf(long k, int v) => new Node { Leaf = true, Key = k, Val = v };
    public static Node MkBranch(int bm, Node[] kids) => new Node { Bitmap = bm, Kids = kids };
}
