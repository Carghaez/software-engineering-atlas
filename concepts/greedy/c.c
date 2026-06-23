// Greedy change-making over a canonical coin system (here greedy is optimal).
#include <assert.h>

int main(void) {
    int coins[] = {25, 10, 5, 1}, n = 4;        // descending denominations
    int amount = 63, count = 0, total = 0;
    for (int i = 0; i < n; i++)
        while (total + coins[i] <= amount) { total += coins[i]; count++; }

    assert(total == amount);
    assert(count == 6);                          // 25+25+10+1+1+1
    return 0;
}
