// 2-D k-d tree: build by median split, then nearest-neighbour query.
#include <vector>
#include <array>
#include <algorithm>
#include <limits>
#include <cassert>

using P = std::array<int, 2>;
struct Kd { P p; int axis; Kd *l = nullptr, *r = nullptr; };

Kd* build(std::vector<P>& pts, int lo, int hi, int depth) {
    if (lo >= hi) return nullptr;
    int axis = depth % 2, mid = (lo + hi) / 2;
    std::nth_element(pts.begin() + lo, pts.begin() + mid, pts.begin() + hi,
                     [axis](const P& a, const P& b) { return a[axis] < b[axis]; });
    Kd* n = new Kd{pts[mid], axis};
    n->l = build(pts, lo, mid, depth + 1);
    n->r = build(pts, mid + 1, hi, depth + 1);
    return n;
}
long d2(const P& a, const P& b) { long dx = a[0]-b[0], dy = a[1]-b[1]; return dx*dx + dy*dy; }

void nearest(Kd* n, const P& q, P& best, long& bd) {
    if (!n) return;
    long dd = d2(n->p, q);
    if (dd < bd) { bd = dd; best = n->p; }
    long diff = q[n->axis] - n->p[n->axis];
    Kd *first = diff < 0 ? n->l : n->r, *second = diff < 0 ? n->r : n->l;
    nearest(first, q, best, bd);
    if (diff * diff < bd) nearest(second, q, best, bd);
}

int main() {
    std::vector<P> pts = {{2,3},{5,4},{9,6},{4,7},{8,1},{7,2}};
    Kd* root = build(pts, 0, (int)pts.size(), 0);
    P q = {9, 2}, best{}; long bd = std::numeric_limits<long>::max();
    nearest(root, q, best, bd);
    assert((best == P{8, 1}));      // nearest point to (9,2)
    return 0;
}
