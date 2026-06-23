// Idiomatic dynamic array in C++: the standard library's std::vector.
#include <vector>
#include <cassert>
#include <cstdio>

int main() {
    std::vector<int> v;                    // empty; grows on demand

    // Amortised O(1) append — vector grows its buffer geometrically.
    for (int i = 0; i < 10; ++i) v.push_back(i * i);

    // O(1) indexed access and size.
    assert(v.size() == 10);
    assert(v[2] == 4);

    // Reserve up front to avoid intermediate reallocations on a known size.
    std::vector<int> squares;
    squares.reserve(10);
    for (int i = 0; i < 10; ++i) squares.push_back(i * i);
    assert(squares.size() == 10 && squares.back() == 81);

    std::printf("len = %zu, third = %d\n", v.size(), v[2]);
    return 0;
}
