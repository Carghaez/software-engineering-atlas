// HyperLogLog: per-register leading-zero maxima -> harmonic-mean cardinality estimate.
#include <cstdint>
#include <vector>
#include <cmath>
#include <cassert>

static uint64_t mix(uint64_t x) {            // splitmix64 finalizer: well-spread hash
    x += 0x9e3779b97f4a7c15ULL;
    x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9ULL;
    x = (x ^ (x >> 27)) * 0x94d049bb133111ebULL;
    return x ^ (x >> 31);
}

int main() {
    const int p = 10, m = 1 << p;            // 1024 registers
    std::vector<int> reg(m, 0);
    for (uint64_t i = 0; i < 5000; i++) {    // 5000 distinct items
        uint64_t h = mix(i);
        int idx = h >> (64 - p);
        uint64_t w = (h << p) | (1ULL << (p - 1));   // sentinel bounds the run
        int rho = __builtin_clzll(w) + 1;
        if (rho > reg[idx]) reg[idx] = rho;
    }
    double Z = 0;
    for (int r : reg) Z += std::pow(2.0, -r);
    double alpha = 0.7213 / (1.0 + 1.079 / m);
    double est = alpha * m * m / Z;
    assert(est > 4500 && est < 5500);        // within ~10% of 5000 true distinct
    return 0;
}
