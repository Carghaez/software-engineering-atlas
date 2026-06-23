// Heapsort in C++ via the standard heap algorithms.
#include <vector>
#include <algorithm>
#include <cassert>

int main() {
    std::vector<int> a{5, 2, 9, 1, 5, 6, 3, 8, 7, 0};

    std::make_heap(a.begin(), a.end());     // build a max-heap in O(n)
    assert(a.front() == 9);                 // max sits at the root

    std::sort_heap(a.begin(), a.end());     // pop the max repeatedly -> ascending
    assert(std::is_sorted(a.begin(), a.end()));
    assert(a.front() == 0 && a.back() == 9);
    return 0;
}
