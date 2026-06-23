// Quicksort in C++ expressing the partition step with std::partition.
#include <vector>
#include <algorithm>
#include <cassert>

void quicksort(std::vector<int>::iterator lo, std::vector<int>::iterator hi) {
    if (hi - lo <= 1) return;
    int pivot = *(lo + (hi - lo) / 2);
    auto m1 = std::partition(lo, hi, [pivot](int x) { return x < pivot; });
    auto m2 = std::partition(m1, hi, [pivot](int x) { return x == pivot; });
    quicksort(lo, m1);                      // < pivot
    quicksort(m2, hi);                      // > pivot
}

int main() {
    std::vector<int> a{5, 2, 9, 1, 5, 6, 3, 8, 7, 0};
    quicksort(a.begin(), a.end());
    assert(std::is_sorted(a.begin(), a.end()));
    assert(a.front() == 0 && a.back() == 9);
    return 0;
}
