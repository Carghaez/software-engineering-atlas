// RRB-style persistent vector: a radix-balanced trie; update copies only the path and shares the rest.
use std::rc::Rc;

const B: usize = 4; // branching factor (real RRB uses 32, plus "relaxed" nodes for O(log n) concat)

#[derive(Clone)]
struct PVec { root: Vec<Rc<[i32; B]>> } // height-2 trie: a spine of leaf blocks

impl PVec {
    fn new() -> Self { PVec { root: vec![Rc::new([0; B]); B] } }
    fn get(&self, i: usize) -> i32 { self.root[i / B][i % B] }
    fn update(&self, i: usize, v: i32) -> PVec {
        let mut root = self.root.clone();   // copy the spine (B pointers)
        let mut leaf = *root[i / B];         // copy only the touched leaf block
        leaf[i % B] = v;
        root[i / B] = Rc::new(leaf);
        PVec { root }
    }
}

fn main() {
    let v0 = PVec::new();
    let v1 = v0.update(5, 50);
    let v2 = v1.update(10, 100);
    assert_eq!(v1.get(5), 50);
    assert_eq!(v2.get(10), 100);
    assert_eq!(v2.get(5), 50); // v1's update is visible through v2 (shared leaf)
    assert_eq!(v0.get(5), 0); // v0 unchanged (persistence)
    assert!(Rc::ptr_eq(&v1.root[0], &v2.root[0])); // untouched leaf block is shared by pointer
}
