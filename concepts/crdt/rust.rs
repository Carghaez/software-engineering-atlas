// CRDT G-Counter: per-replica counts merged by elementwise max -> replicas converge in any order.
use std::collections::HashMap;

#[derive(Clone, Default)]
struct GCounter { counts: HashMap<u32, u64> }

impl GCounter {
    fn inc(&mut self, replica: u32) { *self.counts.entry(replica).or_insert(0) += 1; }
    fn value(&self) -> u64 { self.counts.values().sum() }
    fn merge(&self, other: &GCounter) -> GCounter {
        let mut counts = self.counts.clone();
        for (&r, &c) in &other.counts {
            let e = counts.entry(r).or_insert(0);
            *e = (*e).max(c); // lattice join: idempotent, commutative, associative
        }
        GCounter { counts }
    }
}

fn main() {
    let mut a = GCounter::default();
    let mut b = GCounter::default();
    a.inc(0);
    a.inc(0); // replica A counts 2 under its own id
    b.inc(1); // replica B counts 1 under its own id

    let ab = a.merge(&b);
    let ba = b.merge(&a);
    assert_eq!(ab.value(), 3);
    assert_eq!(ba.value(), 3); // commutative: order of merge does not matter
    assert_eq!(ab.merge(&b).value(), 3); // idempotent: re-merging delivered state is a no-op
    assert_eq!(ab.merge(&ab).value(), 3);
}
