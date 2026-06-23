// Greedy change-making over a canonical coin system (here greedy is optimal).
fn main() {
    let coins = [25, 10, 5, 1]; // descending denominations
    let amount = 63;
    let (mut count, mut total) = (0, 0);
    for c in coins {
        while total + c <= amount {
            total += c;
            count += 1;
        }
    }
    assert_eq!(total, amount);
    assert_eq!(count, 6); // 25+25+10+1+1+1
}
