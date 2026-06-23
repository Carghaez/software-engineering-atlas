// Idiomatic binary search in C++ via <algorithm> on a sorted range.
#include <algorithm>
#include <vector>
#include <cassert>

int main() {
    std::vector<int> a{1, 3, 4, 7, 9, 11, 15};

    assert(std::binary_search(a.begin(), a.end(), 7));
    assert(!std::binary_search(a.begin(), a.end(), 8));   // absent

    // lower_bound gives the position — the building block of binary_search.
    auto it = std::lower_bound(a.begin(), a.end(), 9);
    assert(it != a.end() && *it == 9);
    assert(it - a.begin() == 4);
    return 0;
}
