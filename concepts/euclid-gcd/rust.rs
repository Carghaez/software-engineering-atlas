// Euclid's algorithm for the greatest common divisor.
fn gcd(mut a: u64, mut b: u64) -> u64 {
    while b != 0 {
        let t = a % b;
        a = b;
        b = t;
    }
    a
}

fn main() {
    assert_eq!(gcd(48, 18), 6);
    assert_eq!(gcd(17, 5), 1); // coprime
    assert_eq!(gcd(0, 9), 9); // gcd(0, n) == n
}
