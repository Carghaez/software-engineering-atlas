// Cuckoo filter: store a fingerprint in one of two candidate buckets; supports lookup + delete.
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

const NB: usize = 16;
const SLOTS: usize = 4;

fn loc(k: &str) -> (u8, usize, usize) {
    let mut h = DefaultHasher::new();
    k.hash(&mut h);
    let v = h.finish();
    let f = if (v & 0xff) != 0 { (v & 0xff) as u8 } else { 1 }; // fingerprint, never 0
    let i1 = (v as usize) % NB;
    (f, i1, (i1 ^ f as usize) % NB)
}

struct Cuckoo { tbl: [[u8; SLOTS]; NB] }    // 0 marks an empty slot
impl Cuckoo {
    fn new() -> Self { Cuckoo { tbl: [[0; SLOTS]; NB] } }
    fn insert(&mut self, k: &str) -> bool {
        let (f, i1, i2) = loc(k);
        for b in [i1, i2] {
            for s in self.tbl[b].iter_mut() { if *s == 0 { *s = f; return true; } }
        }
        false
    }
    fn contains(&self, k: &str) -> bool {
        let (f, i1, i2) = loc(k);
        [i1, i2].iter().any(|&b| self.tbl[b].contains(&f))
    }
    fn erase(&mut self, k: &str) -> bool {
        let (f, i1, i2) = loc(k);
        for b in [i1, i2] {
            for s in self.tbl[b].iter_mut() { if *s == f { *s = 0; return true; } }
        }
        false
    }
}

fn main() {
    let mut c = Cuckoo::new();
    c.insert("apple");
    c.insert("banana");
    assert!(c.contains("apple"));   // no false negatives
    assert!(c.contains("banana"));
    assert!(c.erase("apple"));      // deletion supported (a Bloom filter cannot)
    assert!(!c.contains("apple"));  // gone after delete
    assert!(c.contains("banana"));  // other entries unaffected
}
