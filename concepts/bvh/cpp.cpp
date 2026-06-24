// Bounding Volume Hierarchy: a tree of AABBs; a query descends only into boxes it overlaps.
#include <vector>
#include <algorithm>
#include <cassert>

struct Node { float lo[2], hi[2]; int left, right, obj; };   // obj < 0 for inner nodes
std::vector<Node> bvh;
int probes;

int leaf(float x, float y, int id) {
    bvh.push_back({{x, y}, {x + 1, y + 1}, -1, -1, id});
    return (int)bvh.size() - 1;
}
int inner(int l, int r) {                       // a real builder picks l,r by a split heuristic (SAH)
    Node n{{0, 0}, {0, 0}, l, r, -1};
    for (int k : {0, 1}) { n.lo[k] = std::min(bvh[l].lo[k], bvh[r].lo[k]); n.hi[k] = std::max(bvh[l].hi[k], bvh[r].hi[k]); }
    bvh.push_back(n);
    return (int)bvh.size() - 1;
}
int query(int i, float x, float y) {
    probes++;
    const Node& n = bvh[i];
    if (x < n.lo[0] || x > n.hi[0] || y < n.lo[1] || y > n.hi[1]) return -1;   // miss -> prune subtree
    if (n.obj >= 0) return n.obj;
    int h = query(n.left, x, y);
    return h >= 0 ? h : query(n.right, x, y);
}
int main() {
    int a = leaf(0, 0, 0), b = leaf(5, 0, 1), c = leaf(0, 5, 2), d = leaf(5, 5, 3);
    int root = inner(inner(a, c), inner(b, d));
    probes = 0;
    assert(query(root, 0.5f, 0.5f) == 0);   // inside leaf a
    assert(probes < (int)bvh.size());        // pruned the far subtree
    assert(query(root, 9.0f, 9.0f) == -1);   // outside every leaf
    return 0;
}
