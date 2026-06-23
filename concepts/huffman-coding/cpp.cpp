// Huffman coding cost: greedily merge the two smallest weights (min-heap).
#include <queue>
#include <vector>
#include <cassert>

int main() {
    std::priority_queue<int, std::vector<int>, std::greater<>> pq;
    for (int f : {5, 9, 12, 13, 16, 45}) pq.push(f);

    long total = 0;                          // sum of merge weights = total bits
    while (pq.size() > 1) {
        int a = pq.top(); pq.pop();
        int b = pq.top(); pq.pop();
        total += a + b;
        pq.push(a + b);
    }

    assert(total == 224);     // optimal weighted path length for these frequencies
    return 0;
}
