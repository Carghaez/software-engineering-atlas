// Branch and bound: 0/1 knapsack — prune any subtree whose optimistic bound can't beat the best.
#include <vector>
#include <algorithm>
#include <cassert>

int n, cap, best = 0;
std::vector<int> wt, val;   // pre-sorted by value/weight ratio (descending)

int bound(int i, int w, int v) {           // fractional-knapsack optimistic (admissible) bound
    int b = v, room = cap - w;
    for (int j = i; j < n && room > 0; j++) {
        int take = std::min(room, wt[j]);
        b += val[j] * take / wt[j];
        room -= take;
    }
    return b;
}
void dfs(int i, int w, int v) {
    if (v > best) best = v;                // every reached node is a feasible packing
    if (i >= n || bound(i, w, v) <= best) return;   // prune
    if (w + wt[i] <= cap) dfs(i + 1, w + wt[i], v + val[i]);   // take item i
    dfs(i + 1, w, v);                                          // skip item i
}
int main() {
    wt = {2, 3, 4, 5}; val = {3, 4, 5, 6}; cap = 5; n = 4;   // ratios 1.50,1.33,1.25,1.20
    dfs(0, 0, 0);
    assert(best == 7);   // items {w2,v3} + {w3,v4} = weight 5, value 7 is optimal
    return 0;
}
