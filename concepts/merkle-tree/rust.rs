// Merkle tree: hash leaves, then hash pairs up the tree; the root commits to all.
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

fn h(parts: &[u64]) -> u64 {
    let mut s = DefaultHasher::new();
    parts.hash(&mut s);
    s.finish()
}

fn merkle_root(leaves: &[u64]) -> u64 {
    let mut level: Vec<u64> = leaves.iter().map(|x| h(&[*x])).collect();
    while level.len() > 1 {
        if level.len() % 2 == 1 {
            level.push(*level.last().unwrap()); // pad odd level
        }
        level = level.chunks(2).map(|p| h(&[p[0], p[1]])).collect();
    }
    level[0]
}

fn main() {
    let root = merkle_root(&[10, 20, 30, 40]);
    assert_eq!(root, merkle_root(&[10, 20, 30, 40])); // deterministic commitment
    assert_ne!(root, merkle_root(&[10, 20, 30, 41])); // any change flips the root
}
