// Bounding Volume Hierarchy: a tree of AABBs; a query descends only into boxes it overlaps.
var bvh = new System.Collections.Generic.List<Node>();
int probes = 0;

int Leaf(float x, float y, int id)
{
    bvh.Add(new Node { lox = x, loy = y, hix = x + 1, hiy = y + 1, left = -1, right = -1, obj = id });
    return bvh.Count - 1;
}
int Inner(int l, int r)   // a real builder picks l,r by a split heuristic (SAH)
{
    var n = new Node { left = l, right = r, obj = -1 };
    n.lox = Math.Min(bvh[l].lox, bvh[r].lox); n.loy = Math.Min(bvh[l].loy, bvh[r].loy);
    n.hix = Math.Max(bvh[l].hix, bvh[r].hix); n.hiy = Math.Max(bvh[l].hiy, bvh[r].hiy);
    bvh.Add(n);
    return bvh.Count - 1;
}
int Query(int i, float x, float y)
{
    probes++;
    Node n = bvh[i];
    if (x < n.lox || x > n.hix || y < n.loy || y > n.hiy) return -1;   // miss -> prune subtree
    if (n.obj >= 0) return n.obj;
    int h = Query(n.left, x, y);
    return h >= 0 ? h : Query(n.right, x, y);
}

int a = Leaf(0, 0, 0), b = Leaf(5, 0, 1), c = Leaf(0, 5, 2), d = Leaf(5, 5, 3);
int root = Inner(Inner(a, c), Inner(b, d));
probes = 0;
Check(Query(root, 0.5f, 0.5f) == 0, "hit-a");   // inside leaf a
Check(probes < bvh.Count, "pruned");             // pruned the far subtree
Check(Query(root, 9.0f, 9.0f) == -1, "miss");    // outside every leaf

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}

struct Node { public float lox, loy, hix, hiy; public int left, right, obj; }
