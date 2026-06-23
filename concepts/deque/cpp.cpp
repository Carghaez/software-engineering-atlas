// Idiomatic double-ended queue in C++: std::deque.
#include <deque>
#include <cassert>

int main() {
    std::deque<int> d;
    d.push_back(1); d.push_front(2); d.push_back(3);   // -> [2, 1, 3]
    assert(d.front() == 2 && d.back() == 3);
    assert(d.size() == 3);
    d.pop_front(); assert(d.front() == 1);
    d.pop_back();  assert(d.back() == 1);
    return 0;
}
