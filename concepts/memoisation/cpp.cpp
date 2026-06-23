// Memoisation: top-down Fibonacci, each subproblem computed once.
#include <vector>
#include <cassert>

std::vector<long long> memo;

long long fib(int n) {
    if (n < 2) return n;
    if (memo[n] != -1) return memo[n];          // cache hit
    return memo[n] = fib(n - 1) + fib(n - 2);   // compute & cache
}

int main() {
    memo.assign(51, -1);
    assert(fib(10) == 55);
    assert(fib(50) == 12586269025LL);
    return 0;
}
