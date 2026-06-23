// Dynamic programming: 0/1 knapsack with a 1-D capacity table.
#include <vector>
#include <algorithm>
#include <cassert>

int main() {
    std::vector<int> w{1, 3, 4, 5}, v{1, 4, 5, 7};
    int W = 7;
    std::vector<int> dp(W + 1, 0);              // dp[c] = best value at capacity c
    for (std::size_t i = 0; i < w.size(); ++i)
        for (int c = W; c >= w[i]; --c)         // reverse so each item is used once
            dp[c] = std::max(dp[c], dp[c - w[i]] + v[i]);
    assert(dp[W] == 9);
    return 0;
}
