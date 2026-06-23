// Sparse set of small integers: O(1) insert / remove / membership.
#include <assert.h>

#define CAP 100
int dense[CAP], sparse[CAP], n;

int contains(int x) { int i = sparse[x]; return i < n && dense[i] == x; }
void insert(int x)  { if (contains(x)) return; sparse[x] = n; dense[n++] = x; }
void erase(int x) {
    if (!contains(x)) return;
    int i = sparse[x], last = dense[--n];
    dense[i] = last; sparse[last] = i;       // move the last element into the hole
}

int main(void) {
    n = 0;
    insert(5); insert(42); insert(5); insert(7);   // duplicate 5 ignored
    assert(n == 3);
    assert(contains(42) && !contains(8));
    erase(42);
    assert(!contains(42) && contains(5) && contains(7));
    assert(n == 2);
    return 0;
}
