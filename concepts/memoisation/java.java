// Memoisation: top-down Fibonacci, each subproblem computed once.
import java.util.Arrays;

class Main {
    static long[] memo;

    static long fib(int n) {
        if (n < 2) return n;
        if (memo[n] != -1) return memo[n];          // cache hit
        return memo[n] = fib(n - 1) + fib(n - 2);   // compute & cache
    }

    public static void main(String[] args) {
        memo = new long[51];
        Arrays.fill(memo, -1);
        assert fib(10) == 55;
        assert fib(50) == 12586269025L;
        System.out.println(fib(50));
    }
}
