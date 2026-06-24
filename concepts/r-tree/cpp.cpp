// R-tree: data rectangles grouped under minimum bounding rectangles; a window query skips non-overlapping MBRs.
#include <vector>
#include <cassert>

struct Rect { float x0, y0, x1, y1; };
bool overlap(const Rect& a, const Rect& b) {
    return a.x0 <= b.x1 && b.x0 <= a.x1 && a.y0 <= b.y1 && b.y0 <= a.y1;
}
struct Entry { Rect box; int id; };
struct Node { Rect mbr; std::vector<Entry> entries; };

int probes = 0;
std::vector<int> query(const std::vector<Node>& tree, const Rect& w) {
    std::vector<int> hits;
    for (const Node& n : tree) {
        if (!overlap(n.mbr, w)) continue;                 // prune the whole node by its MBR
        for (const Entry& e : n.entries) { probes++; if (overlap(e.box, w)) hits.push_back(e.id); }
    }
    return hits;
}
int main() {
    std::vector<Node> tree = {
        {{0, 0, 3, 3}, {{{0, 0, 1, 1}, 0}, {{2, 2, 3, 3}, 1}}},   // left node, MBR (0,0)-(3,3)
        {{5, 5, 8, 8}, {{{5, 5, 6, 6}, 2}, {{7, 7, 8, 8}, 3}}},   // right node, MBR (5,5)-(8,8)
    };
    auto hits = query(tree, {0.5f, 0.5f, 2.5f, 2.5f});   // window near the origin
    assert((hits == std::vector<int>{0, 1}));
    assert(probes == 2);   // only the left node's entries probed; right MBR pruned
    return 0;
}
