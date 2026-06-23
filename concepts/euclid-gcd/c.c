// Euclid's algorithm for the greatest common divisor.
#include <assert.h>

static long gcd(long a, long b) {
    while (b != 0) { long t = a % b; a = b; b = t; }
    return a < 0 ? -a : a;
}

int main(void) {
    assert(gcd(48, 18) == 6);
    assert(gcd(17, 5) == 1);    // coprime
    assert(gcd(0, 9) == 9);     // gcd(0, n) == n
    assert(gcd(54, 24) == 6);
    return 0;
}
