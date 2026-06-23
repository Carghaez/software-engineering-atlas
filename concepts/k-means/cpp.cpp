// k-means (Lloyd's iteration) on 2-D points, k = 2.
#include <vector>
#include <array>
#include <cmath>
#include <cassert>

int main() {
    std::vector<std::array<double, 2>> pts = {
        {0,0},{1,0},{0,1},{1,1}, {10,10},{11,10},{10,11},{11,11}};
    std::array<std::array<double, 2>, 2> c = {{{0, 0}, {10, 10}}};   // initial centroids
    std::vector<int> assign(pts.size(), 0);

    for (int it = 0; it < 10; it++) {
        for (size_t i = 0; i < pts.size(); i++) {                    // assignment step
            double d0 = std::hypot(pts[i][0] - c[0][0], pts[i][1] - c[0][1]);
            double d1 = std::hypot(pts[i][0] - c[1][0], pts[i][1] - c[1][1]);
            assign[i] = d0 <= d1 ? 0 : 1;
        }
        double sx[2] = {0, 0}, sy[2] = {0, 0}; int cnt[2] = {0, 0};   // update step
        for (size_t i = 0; i < pts.size(); i++) { int a = assign[i]; sx[a] += pts[i][0]; sy[a] += pts[i][1]; cnt[a]++; }
        for (int k = 0; k < 2; k++) if (cnt[k]) { c[k][0] = sx[k] / cnt[k]; c[k][1] = sy[k] / cnt[k]; }
    }

    for (int i = 0; i < 4; i++) assert(assign[i] == assign[0]);      // near-origin cluster
    for (int i = 4; i < 8; i++) assert(assign[i] == assign[4]);      // far cluster
    assert(assign[0] != assign[4]);                                  // two distinct clusters
    return 0;
}
