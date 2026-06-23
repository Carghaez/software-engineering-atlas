// Top-down merge sort in C++ using std::merge for the combine step.
#include <vector>
#include <algorithm>
#include <iterator>
#include <cassert>

std::vector<int> merge_sort(const std::vector<int>& a) {
    if (a.size() <= 1) return a;
    std::size_t mid = a.size() / 2;
    auto left  = merge_sort(std::vector<int>(a.begin(), a.begin() + mid));
    auto right = merge_sort(std::vector<int>(a.begin() + mid, a.end()));
    std::vector<int> out;
    out.reserve(a.size());
    std::merge(left.begin(), left.end(), right.begin(), right.end(),
               std::back_inserter(out));
    return out;
}

int main() {
    std::vector<int> a{5, 2, 9, 1, 5, 6, 3, 8, 7, 0};
    auto s = merge_sort(a);
    assert(std::is_sorted(s.begin(), s.end()));
    assert(s.front() == 0 && s.back() == 9);
    return 0;
}
