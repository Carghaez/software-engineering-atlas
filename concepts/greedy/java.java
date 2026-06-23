// Greedy change-making over a canonical coin system (here greedy is optimal).
class Main {
    public static void main(String[] args) {
        int[] coins = {25, 10, 5, 1};           // descending denominations
        int amount = 63, count = 0, total = 0;
        for (int c : coins)
            while (total + c <= amount) { total += c; count++; }

        assert total == amount && count == 6;    // 25+25+10+1+1+1
        System.out.println(count);
    }
}
