// Greedy change-making over a canonical coin system (here greedy is optimal).
int[] coins = { 25, 10, 5, 1 };                 // descending denominations
int amount = 63, count = 0, total = 0;
foreach (int c in coins)
    while (total + c <= amount) { total += c; count++; }

Check(total == amount && count == 6, "greedy change");   // 25+25+10+1+1+1

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
