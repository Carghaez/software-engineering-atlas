// Dynamic programming: 0/1 knapsack with a 1-D capacity table.
fn main() {
    let w = [1usize, 3, 4, 5];
    let v = [1, 4, 5, 7];
    let cap = 7usize;
    let mut dp = vec![0; cap + 1]; // dp[c] = best value at capacity c
    for i in 0..w.len() {
        for c in (w[i]..=cap).rev() {
            // reverse so each item is used at most once
            dp[c] = dp[c].max(dp[c - w[i]] + v[i]);
        }
    }
    assert_eq!(dp[cap], 9);
}
