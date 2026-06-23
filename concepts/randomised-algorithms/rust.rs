// Randomised quickselect: random pivot (xorshift) -> O(n) expected k-th smallest.
struct Rng(u64);
impl Rng {
    fn next(&mut self) -> u64 {
        self.0 ^= self.0 << 13;
        self.0 ^= self.0 >> 7;
        self.0 ^= self.0 << 17;
        self.0
    }
}

fn quickselect(mut a: Vec<i32>, k: usize) -> i32 {
    let mut rng = Rng(88172645463325252);
    let (mut lo, mut hi) = (0usize, a.len() - 1);
    while lo < hi {
        let pi = lo + (rng.next() % (hi - lo + 1) as u64) as usize;
        a.swap(pi, hi); // random pivot to the end
        let mut store = lo;
        for i in lo..hi {
            if a[i] < a[hi] {
                a.swap(i, store);
                store += 1;
            }
        }
        a.swap(store, hi);
        if store == k {
            return a[store];
        }
        if store < k { lo = store + 1; } else { hi = store - 1; }
    }
    a[lo]
}

fn main() {
    let v = vec![7, 2, 9, 1, 5, 6, 3, 8, 4, 0];
    assert_eq!(quickselect(v.clone(), 0), 0);
    assert_eq!(quickselect(v.clone(), 9), 9);
    assert_eq!(quickselect(v, 5), 5);
}
