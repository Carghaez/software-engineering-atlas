// Memoisation: top-down Fibonacci, each subproblem computed once.
var memo = new long[51];
Array.Fill(memo, -1);

long Fib(int n)
{
    if (n < 2) return n;
    if (memo[n] != -1) return memo[n];          // cache hit
    return memo[n] = Fib(n - 1) + Fib(n - 2);   // compute & cache
}

Check(Fib(10) == 55, "fib(10)");
Check(Fib(50) == 12586269025, "fib(50)");

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
