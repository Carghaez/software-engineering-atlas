// Suffix array of "banana" by sorting suffix start indices (naive comparator).
#include <string>
#include <vector>
#include <algorithm>
#include <numeric>
#include <cassert>

int main() {
    std::string s = "banana";
    int n = (int)s.size();
    std::vector<int> sa(n);
    std::iota(sa.begin(), sa.end(), 0);
    std::sort(sa.begin(), sa.end(), [&](int a, int b) {
        return s.compare(a, std::string::npos, s, b, std::string::npos) < 0;
    });

    std::vector<int> expected{5, 3, 1, 0, 4, 2};
    assert(sa == expected);
    return 0;
}
