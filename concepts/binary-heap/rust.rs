// Idiomatic binary heap in Rust: std::collections::BinaryHeap (a max-heap).
use std::collections::BinaryHeap;

fn main() {
    let mut heap: BinaryHeap<i32> = BinaryHeap::new();
    for x in [3, 1, 4, 1, 5, 9, 2, 6] {
        heap.push(x);
    }

    assert_eq!(heap.peek(), Some(&9)); // max at the top

    let mut prev = i32::MAX;
    while let Some(top) = heap.pop() {
        assert!(top <= prev); // pops in descending order
        prev = top;
    }
    assert_eq!(prev, 1);
}
