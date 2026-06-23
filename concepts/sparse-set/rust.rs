// Sparse set of small integers: O(1) insert / remove / membership.
struct SparseSet {
    dense: Vec<usize>,
    sparse: Vec<usize>,
    n: usize,
}

impl SparseSet {
    fn new(cap: usize) -> Self {
        SparseSet { dense: vec![0; cap], sparse: vec![0; cap], n: 0 }
    }
    fn contains(&self, x: usize) -> bool {
        let i = self.sparse[x];
        i < self.n && self.dense[i] == x
    }
    fn insert(&mut self, x: usize) {
        if self.contains(x) {
            return;
        }
        self.sparse[x] = self.n;
        self.dense[self.n] = x;
        self.n += 1;
    }
    fn erase(&mut self, x: usize) {
        if !self.contains(x) {
            return;
        }
        self.n -= 1;
        let (i, last) = (self.sparse[x], self.dense[self.n]);
        self.dense[i] = last;
        self.sparse[last] = i;
    }
}

fn main() {
    let mut s = SparseSet::new(100);
    s.insert(5);
    s.insert(42);
    s.insert(5);
    s.insert(7);
    assert_eq!(s.n, 3);
    assert!(s.contains(42) && !s.contains(8));
    s.erase(42);
    assert!(!s.contains(42) && s.contains(5) && s.contains(7));
}
