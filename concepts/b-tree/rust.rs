// B-tree map in Rust's standard library: std::collections::BTreeMap.
use std::collections::BTreeMap;

fn main() {
    let mut m = BTreeMap::new();
    for k in [50, 20, 80, 10, 30, 70, 90] {
        m.insert(k, k * k);
    }

    let keys: Vec<i32> = m.keys().copied().collect();
    assert_eq!(keys, vec![10, 20, 30, 50, 70, 80, 90]); // sorted, any insert order
    assert_eq!(m[&30], 900);

    // Ordered range query: keys in [20, 70).
    let r: Vec<i32> = m.range(20..70).map(|(k, _)| *k).collect();
    assert_eq!(r, vec![20, 30, 50]);
}
