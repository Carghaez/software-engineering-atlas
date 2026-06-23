// Bloom filter: k=2 hashes over a bit vector; no false negatives.
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

fn hashes(s: &str, m: usize) -> (usize, usize) {
    let mut h1 = DefaultHasher::new();
    s.hash(&mut h1);
    let mut h2 = DefaultHasher::new();
    (s, 1u8).hash(&mut h2);
    (h1.finish() as usize % m, h2.finish() as usize % m)
}

fn main() {
    let m = 1024;
    let mut bits = vec![false; m];
    for w in ["apple", "banana"] {
        let (a, b) = hashes(w, m);
        bits[a] = true;
        bits[b] = true;
    }
    let maybe = |s: &str| {
        let (a, b) = hashes(s, m);
        bits[a] && bits[b]
    };
    assert!(maybe("apple")); // no false negatives
    assert!(maybe("banana"));
    assert!(!maybe("cherry")); // true negative (no collision here)
}
