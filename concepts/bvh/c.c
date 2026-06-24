// Bounding Volume Hierarchy: a tree of AABBs; a query descends only into boxes it overlaps.
#include <assert.h>

typedef struct { float lo[2], hi[2]; int left, right, obj; } Node;   // obj < 0 for inner nodes
Node bvh[16]; int nNodes = 0, probes;

int leaf(float x, float y, int id) {
    bvh[nNodes] = (Node){{x, y}, {x + 1, y + 1}, -1, -1, id};
    return nNodes++;
}
int inner(int l, int r) {                       // a real builder picks l,r by a split heuristic (SAH)
    Node n; n.left = l; n.right = r; n.obj = -1;
    for (int k = 0; k < 2; k++) {
        n.lo[k] = bvh[l].lo[k] < bvh[r].lo[k] ? bvh[l].lo[k] : bvh[r].lo[k];
        n.hi[k] = bvh[l].hi[k] > bvh[r].hi[k] ? bvh[l].hi[k] : bvh[r].hi[k];
    }
    bvh[nNodes] = n; return nNodes++;
}
int query(int i, float x, float y) {
    probes++;
    Node *n = &bvh[i];
    if (x < n->lo[0] || x > n->hi[0] || y < n->lo[1] || y > n->hi[1]) return -1;   // miss -> prune
    if (n->obj >= 0) return n->obj;
    int h = query(n->left, x, y);
    return h >= 0 ? h : query(n->right, x, y);
}
int main(void) {
    int a = leaf(0, 0, 0), b = leaf(5, 0, 1), c = leaf(0, 5, 2), d = leaf(5, 5, 3);
    int root = inner(inner(a, c), inner(b, d));
    probes = 0;
    assert(query(root, 0.5f, 0.5f) == 0);   // inside leaf a
    assert(probes < nNodes);                 // pruned the far subtree
    assert(query(root, 9.0f, 9.0f) == -1);   // outside every leaf
    return 0;
}
