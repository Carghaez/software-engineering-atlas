// HAMT: a persistent map; 5-bit hash chunks index a bitmap-compressed trie, sharing structure on update.
use std::rc::Rc;

#[derive(Clone)]
enum Node {
    Leaf(u64, i32),               // (key, value)
    Branch(u32, Vec<Rc<Node>>),   // bitmap + compact children array
}

fn slot(key: u64, shift: u32) -> u32 { ((key >> shift) & 31) as u32 } // key doubles as its hash

fn get(n: &Node, key: u64, shift: u32) -> Option<i32> {
    match n {
        Node::Leaf(k, v) => if *k == key { Some(*v) } else { None },
        Node::Branch(bm, kids) => {
            let bit = 1u32 << slot(key, shift);
            if bm & bit == 0 { return None; }
            let pos = (bm & (bit - 1)).count_ones() as usize;
            get(&kids[pos], key, shift + 5)
        }
    }
}

fn insert(n: &Node, key: u64, val: i32, shift: u32) -> Node {
    match n {
        Node::Leaf(k, v) => {
            if *k == key { return Node::Leaf(key, val); }     // replace
            let b = insert(&Node::Branch(0, vec![]), *k, *v, shift);   // push both down
            insert(&b, key, val, shift)
        }
        Node::Branch(bm, kids) => {
            let bit = 1u32 << slot(key, shift);
            let pos = (bm & (bit - 1)).count_ones() as usize;
            let mut kids = kids.clone();                       // copy spine; subtrees shared
            if bm & bit == 0 {
                kids.insert(pos, Rc::new(Node::Leaf(key, val)));
                Node::Branch(bm | bit, kids)
            } else {
                kids[pos] = Rc::new(insert(&kids[pos], key, val, shift + 5));
                Node::Branch(*bm, kids)
            }
        }
    }
}

fn main() {
    let v1 = insert(&Node::Branch(0, vec![]), 10, 100, 0);
    let v2 = insert(&v1, 20, 200, 0);
    let v3 = insert(&v2, 10, 999, 0);          // update key 10
    assert_eq!(get(&v2, 10, 0), Some(100));
    assert_eq!(get(&v3, 10, 0), Some(999));    // new version sees the update
    assert_eq!(get(&v2, 10, 0), Some(100));    // old version unchanged (persistence)
    assert_eq!(get(&v2, 30, 0), None);
}
