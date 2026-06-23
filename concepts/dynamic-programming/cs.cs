// Dynamic programming: 0/1 knapsack with a 1-D capacity table.
int[] w = { 1, 3, 4, 5 }, v = { 1, 4, 5, 7 };
int W = 7;
var dp = new int[W + 1];                        // dp[c] = best value at capacity c
for (int i = 0; i < w.Length; i++)
    for (int c = W; c >= w[i]; c--)             // reverse so each item is used once
        dp[c] = Math.Max(dp[c], dp[c - w[i]] + v[i]);

Check(dp[W] == 9, "best knapsack value");

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
