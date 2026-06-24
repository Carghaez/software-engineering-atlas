// BSP tree: split space by planes so an ordered walk yields back-to-front (painter's) order, no sorting.
#include <vector>
#include <cassert>

struct Node { float x; int id; Node *neg = nullptr, *pos = nullptr; };   // splitting plane X = x

// Visit the far side of each plane first, relative to viewer vx -> back-to-front order.
void paint(Node* n, float vx, std::vector<int>& order) {
    if (!n) return;
    if (vx < n->x) { paint(n->pos, vx, order); order.push_back(n->id); paint(n->neg, vx, order); }
    else           { paint(n->neg, vx, order); order.push_back(n->id); paint(n->pos, vx, order); }
}

int main() {
    Node b{1, 0}, c{5, 2}, a{3, 1};        // vertical walls at x = 1, 5, 3 (ids 0, 2, 1)
    a.neg = &b; a.pos = &c;                // BSP: root wall x=3, x=1 behind it, x=5 in front

    std::vector<int> order;
    paint(&a, 0.0f, order);                // viewer far left (x=0)
    assert((order == std::vector<int>{2, 1, 0}));   // farthest wall (x=5) drawn first

    order.clear();
    paint(&a, 6.0f, order);                // viewer far right (x=6)
    assert((order == std::vector<int>{0, 1, 2}));   // order reverses: farthest (x=1) first
    return 0;
}
