// Streaming algorithms: a single pass in O(1) memory. Boyer-Moore majority vote over a stream.
#include <vector>
#include <cassert>

int majority(const std::vector<int>& stream) {
    int cand = 0, count = 0;               // one candidate, one counter — constant memory
    for (int x : stream) {
        if (count == 0) cand = x;
        count += (x == cand) ? 1 : -1;
    }
    return cand;                            // the >n/2 element, if one exists
}

int main() {
    std::vector<int> stream = {3, 3, 4, 2, 3, 3, 5, 3, 3};   // 3 appears 6 of 9 times
    int m = majority(stream);
    int seen = 0;
    for (int x : stream) seen += (x == m);
    assert(m == 3 && seen * 2 > (int)stream.size());          // verified majority in one pass
    return 0;
}
