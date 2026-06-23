// Dynamic programming: 0/1 knapsack with a 1-D capacity table.
#include <assert.h>

int main(void) {
    int w[] = {1, 3, 4, 5}, v[] = {1, 4, 5, 7}, n = 4, W = 7;
    int dp[8] = {0};                            // dp[c] = best value at capacity c
    for (int i = 0; i < n; i++)
        for (int c = W; c >= w[i]; c--) {       // reverse so each item is used once
            int cand = dp[c - w[i]] + v[i];
            if (cand > dp[c]) dp[c] = cand;
        }
    assert(dp[W] == 9);                          // items weighing 3 and 4 -> 4 + 5
    return 0;
}
