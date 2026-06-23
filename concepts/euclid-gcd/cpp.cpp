// Euclid's algorithm for the greatest common divisor (constexpr).
#include <cassert>

constexpr long gcd(long a, long b) {
    while (b != 0) { long t = a % b; a = b; b = t; }
    return a < 0 ? -a : a;
}

int main() {
    static_assert(gcd(48, 18) == 6);   // evaluated at compile time
    assert(gcd(17, 5) == 1);           // coprime
    assert(gcd(0, 9) == 9);            // gcd(0, n) == n
    return 0;
}
