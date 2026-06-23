// Point-region quadtree: subdivides into 4 quadrants past a node capacity of 4.
#include <assert.h>
#include <stdlib.h>

typedef struct { double x, y; } Pt;
typedef struct QT {
    double cx, cy, half;        // centre and half-extent of this region
    Pt pts[4]; int n;           // points held before subdividing
    struct QT *kid[4];          // NW, NE, SW, SE
    int divided;
} QT;

static QT *make(double cx, double cy, double half) {
    QT *q = calloc(1, sizeof(QT)); q->cx = cx; q->cy = cy; q->half = half; return q;
}
static int contains(QT *q, Pt p) {
    return p.x >= q->cx - q->half && p.x < q->cx + q->half &&
           p.y >= q->cy - q->half && p.y < q->cy + q->half;
}
static void subdivide(QT *q) {
    double h = q->half / 2;
    q->kid[0] = make(q->cx - h, q->cy + h, h);   // NW
    q->kid[1] = make(q->cx + h, q->cy + h, h);   // NE
    q->kid[2] = make(q->cx - h, q->cy - h, h);   // SW
    q->kid[3] = make(q->cx + h, q->cy - h, h);   // SE
    q->divided = 1;
}
static int insert(QT *q, Pt p) {
    if (!contains(q, p)) return 0;
    if (q->n < 4 && !q->divided) { q->pts[q->n++] = p; return 1; }
    if (!q->divided) subdivide(q);
    for (int i = 0; i < 4; i++) if (insert(q->kid[i], p)) return 1;
    return 0;
}
static int count(QT *q) {
    int c = q->n;
    if (q->divided) for (int i = 0; i < 4; i++) c += count(q->kid[i]);
    return c;
}

int main(void) {
    QT *root = make(0, 0, 16);
    Pt data[] = {{1,1},{2,2},{3,3},{-4,-4},{5,-5},{-6,6},{7,7},{-1,-1},{0,0}};
    int inserted = 0;
    for (int i = 0; i < 9; i++) inserted += insert(root, data[i]);
    assert(inserted == 9);          // all points lie within the root region
    assert(count(root) == 9);       // and are retained after subdivision
    return 0;
}
