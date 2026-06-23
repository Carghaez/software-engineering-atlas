// Idiomatic queue ADT in C++: std::queue (FIFO) adapting a deque.
#include <queue>
#include <cassert>

int main() {
    std::queue<int> q;
    for (int i = 1; i <= 3; i++) q.push(i);

    assert(q.front() == 1);                // first in, first out
    q.pop(); assert(q.front() == 2);
    q.pop(); assert(q.front() == 3);
    q.pop(); assert(q.empty());
    return 0;
}
