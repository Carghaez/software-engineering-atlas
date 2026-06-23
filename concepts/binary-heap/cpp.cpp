// Idiomatic binary heap in C++: std::priority_queue (a max-heap by default).
#include <queue>
#include <vector>
#include <cassert>

int main() {
    std::priority_queue<int> pq;
    for (int x : {3, 1, 4, 1, 5, 9, 2, 6}) pq.push(x);

    assert(pq.top() == 9);                  // max at the top

    int prev = 1000;
    while (!pq.empty()) {
        assert(pq.top() <= prev);           // pops in descending order
        prev = pq.top();
        pq.pop();
    }
    assert(prev == 1);
    return 0;
}
