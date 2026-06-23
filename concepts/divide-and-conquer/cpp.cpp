// Divide and conquer: maximum-subarray sum.
#include <vector>
#include <algorithm>
#include <climits>
#include <cassert>

int max_sub(const std::vector<int>& a, int lo, int hi) {
    if (lo == hi) return a[lo];
    int mid = (lo + hi) / 2;
    int left = max_sub(a, lo, mid), right = max_sub(a, mid + 1, hi);
    int s = 0, lbest = INT_MIN;
    for (int i = mid; i >= lo; i--) { s += a[i]; lbest = std::max(lbest, s); }
    s = 0; int rbest = INT_MIN;
    for (int i = mid + 1; i <= hi; i++) { s += a[i]; rbest = std::max(rbest, s); }
    return std::max({left, right, lbest + rbest});
}

int main() {
    std::vector<int> a{-2, 1, -3, 4, -1, 2, 1, -5, 4};
    assert(max_sub(a, 0, (int)a.size() - 1) == 6);      // subarray [4, -1, 2, 1]
    return 0;
}
