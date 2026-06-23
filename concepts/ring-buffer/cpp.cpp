// Fixed-capacity ring (circular) buffer with wraparound indices.
#include <array>
#include <cstddef>
#include <cassert>

template <class T, std::size_t Cap>
class Ring {
    std::array<T, Cap> buf{};
    std::size_t head = 0, count = 0;
public:
    bool full() const { return count == Cap; }
    bool empty() const { return count == 0; }
    void push(T v) { assert(!full()); buf[(head + count) % Cap] = v; ++count; }
    T pop() { assert(!empty()); T v = buf[head]; head = (head + 1) % Cap; --count; return v; }
};

int main() {
    Ring<int, 4> r;
    r.push(1); r.push(2); r.push(3);
    assert(r.pop() == 1);
    r.push(4); r.push(5);            // indices wrap around
    assert(r.full());
    assert(r.pop() == 2 && r.pop() == 3 && r.pop() == 4 && r.pop() == 5);
    assert(r.empty());
    return 0;
}
