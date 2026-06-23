// Heapsort in Rust via the standard BinaryHeap (build heap, drain in order).
use std::collections::BinaryHeap;

fn main() {
    let a = [5, 2, 9, 1, 5, 6, 3, 8, 7, 0];

    let heap = BinaryHeap::from(a.to_vec()); // build a max-heap in O(n)
    let sorted = heap.into_sorted_vec(); // repeatedly extract -> ascending

    assert!(sorted.windows(2).all(|w| w[0] <= w[1]));
    assert_eq!(sorted.first(), Some(&0));
    assert_eq!(sorted.last(), Some(&9));
}
