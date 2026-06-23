// Disjoint-set (union-find) with path compression and union by rank.
#include <assert.h>

enum { N = 10 };
int parent[N], rnk[N];

int find(int x) {
    while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
}
void uni(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return;
    if (rnk[a] < rnk[b]) { int t = a; a = b; b = t; }
    parent[b] = a;
    if (rnk[a] == rnk[b]) rnk[a]++;
}

int main(void) {
    for (int i = 0; i < N; i++) { parent[i] = i; rnk[i] = 0; }
    uni(0, 1); uni(1, 2); uni(3, 4);
    assert(find(0) == find(2));     // 0,1,2 merged
    assert(find(3) == find(4));
    assert(find(0) != find(3));     // still disjoint
    uni(2, 3);
    assert(find(0) == find(4));     // now all connected
    return 0;
}
