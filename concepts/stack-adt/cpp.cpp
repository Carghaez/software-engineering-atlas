// Idiomatic stack ADT in C++: std::stack (LIFO) adapting a deque.
#include <stack>
#include <cassert>

int main() {
    std::stack<int> s;
    for (int i = 1; i <= 3; i++) s.push(i);

    assert(s.top() == 3);                  // last in, first out
    s.pop(); assert(s.top() == 2);
    s.pop(); assert(s.top() == 1);
    s.pop(); assert(s.empty());
    return 0;
}
