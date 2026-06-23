// Dynamic programming: 0/1 knapsack with a 1-D capacity table.
class Main {
    public static void main(String[] args) {
        int[] w = {1, 3, 4, 5}, v = {1, 4, 5, 7};
        int W = 7;
        int[] dp = new int[W + 1];                 // dp[c] = best value at capacity c
        for (int i = 0; i < w.length; i++)
            for (int c = W; c >= w[i]; c--)        // reverse so each item is used once
                dp[c] = Math.max(dp[c], dp[c - w[i]] + v[i]);
        assert dp[W] == 9;
        System.out.println(dp[W]);
    }
}
