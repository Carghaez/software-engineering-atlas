// Point-region quadtree: subdivides into 4 quadrants past a node capacity of 4.
#include <array>
#include <vector>
#include <memory>
#include <cassert>

struct Pt { double x, y; };

struct QT {
    double cx, cy, half;
    std::vector<Pt> pts;
    std::array<std::unique_ptr<QT>, 4> kid;
    bool divided = false;
    QT(double x, double y, double h) : cx(x), cy(y), half(h) {}

    bool contains(Pt p) const {
        return p.x >= cx - half && p.x < cx + half && p.y >= cy - half && p.y < cy + half;
    }
    void subdivide() {
        double h = half / 2;
        kid[0] = std::make_unique<QT>(cx - h, cy + h, h);   // NW
        kid[1] = std::make_unique<QT>(cx + h, cy + h, h);   // NE
        kid[2] = std::make_unique<QT>(cx - h, cy - h, h);   // SW
        kid[3] = std::make_unique<QT>(cx + h, cy - h, h);   // SE
        divided = true;
    }
    bool insert(Pt p) {
        if (!contains(p)) return false;
        if (pts.size() < 4 && !divided) { pts.push_back(p); return true; }
        if (!divided) subdivide();
        for (auto& k : kid) if (k->insert(p)) return true;
        return false;
    }
    int count() const {
        int c = (int)pts.size();
        if (divided) for (auto& k : kid) c += k->count();
        return c;
    }
};

int main() {
    QT root(0, 0, 16);
    Pt data[] = {{1,1},{2,2},{3,3},{-4,-4},{5,-5},{-6,6},{7,7},{-1,-1},{0,0}};
    int inserted = 0;
    for (auto p : data) inserted += root.insert(p) ? 1 : 0;
    assert(inserted == 9);
    assert(root.count() == 9);
    return 0;
}
