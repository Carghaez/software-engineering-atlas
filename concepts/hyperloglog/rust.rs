// HyperLogLog: per-register leading-zero maxima -> harmonic-mean cardinality estimate.
fn mix(mut x: u64) -> u64 {                   // splitmix64 finalizer: well-spread hash
    x = x.wrapping_add(0x9e3779b97f4a7c15);
    x = (x ^ (x >> 30)).wrapping_mul(0xbf58476d1ce4e5b9);
    x = (x ^ (x >> 27)).wrapping_mul(0x94d049bb133111eb);
    x ^ (x >> 31)
}

fn main() {
    let p: u32 = 10;
    let m = 1usize << p;                       // 1024 registers
    let mut reg = vec![0u32; m];
    for i in 0..5000u64 {                      // 5000 distinct items
        let h = mix(i);
        let idx = (h >> (64 - p)) as usize;
        let w = (h << p) | (1u64 << (p - 1));   // sentinel bounds the run
        let rho = w.leading_zeros() + 1;
        if rho > reg[idx] {
            reg[idx] = rho;
        }
    }
    let z: f64 = reg.iter().map(|&r| 2f64.powi(-(r as i32))).sum();
    let alpha = 0.7213 / (1.0 + 1.079 / m as f64);
    let est = alpha * (m * m) as f64 / z;
    assert!(est > 4500.0 && est < 5500.0);      // within ~10% of 5000 true distinct
}
