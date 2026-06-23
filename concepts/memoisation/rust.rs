// Memoisation: top-down Fibonacci, each subproblem computed once.
fn fib(n: usize, memo: &mut Vec<Option<u64>>) -> u64 {
    if n < 2 {
        return n as u64;
    }
    if let Some(v) = memo[n] {
        return v; // cache hit
    }
    let v = fib(n - 1, memo) + fib(n - 2, memo); // compute & cache
    memo[n] = Some(v);
    v
}

fn main() {
    let mut memo = vec![None; 51];
    assert_eq!(fib(10, &mut memo), 55);
    assert_eq!(fib(50, &mut memo), 12586269025);
}
