// Consistent hashing over a BTreeMap ring with virtual nodes.
use std::collections::hash_map::DefaultHasher;
use std::collections::BTreeMap;
use std::hash::{Hash, Hasher};

fn hash(s: &str) -> u64 {
    let mut h = DefaultHasher::new();
    s.hash(&mut h);
    h.finish()
}

struct Ring {
    map: BTreeMap<u64, String>,
}
impl Ring {
    fn new() -> Self { Ring { map: BTreeMap::new() } }
    fn add(&mut self, node: &str) {
        for i in 0..50 {
            self.map.insert(hash(&format!("{node}#{i}")), node.to_string());
        }
    }
    fn remove(&mut self, node: &str) { self.map.retain(|_, v| v != node); }
    fn lookup(&self, key: &str) -> String {
        let h = hash(key);
        self.map
            .range(h..)
            .next()
            .or_else(|| self.map.iter().next()) // wrap clockwise
            .unwrap()
            .1
            .clone()
    }
}

fn main() {
    let mut ring = Ring::new();
    ring.add("A");
    ring.add("B");
    ring.add("C");
    let keys = ["apple", "banana", "cherry", "date", "egg", "fig", "grape", "kiwi"];
    let before: Vec<String> = keys.iter().map(|k| ring.lookup(k)).collect();
    assert_eq!(before[0], ring.lookup("apple")); // deterministic

    ring.remove("C");
    for (i, k) in keys.iter().enumerate() {
        let now = ring.lookup(k);
        if before[i] == "C" {
            assert_ne!(now, "C"); // C's keys moved on
        } else {
            assert_eq!(now, before[i]); // others unchanged
        }
    }
}
