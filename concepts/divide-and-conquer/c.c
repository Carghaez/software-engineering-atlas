// Divide and conquer: maximum-subarray sum.
#include <assert.h>
#include <limits.h>

int max3(int a, int b, int c) { int m = a > b ? a : b; return m > c ? m : c; }

int max_sub(const int *a, int lo, int hi) {
    if (lo == hi) return a[lo];
    int mid = (lo + hi) / 2;
    int left = max_sub(a, lo, mid), right = max_sub(a, mid + 1, hi);
    int s = 0, lbest = INT_MIN;
    for (int i = mid; i >= lo; i--) { s += a[i]; if (s > lbest) lbest = s; }
    s = 0; int rbest = INT_MIN;
    for (int i = mid + 1; i <= hi; i++) { s += a[i]; if (s > rbest) rbest = s; }
    return max3(left, right, lbest + rbest);
}

int main(void) {
    int a[] = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    int n = (int)(sizeof a / sizeof a[0]);
    assert(max_sub(a, 0, n - 1) == 6);      // subarray [4, -1, 2, 1]
    return 0;
}
