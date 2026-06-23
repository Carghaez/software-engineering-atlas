// Huffman coding cost: greedily merge the two smallest weights (min-heap).
use std::cmp::Reverse;
use std::collections::BinaryHeap;

fn main() {
    let mut pq: BinaryHeap<Reverse<i64>> =
        [5, 9, 12, 13, 16, 45].iter().map(|&f| Reverse(f)).collect();

    let mut total = 0; // sum of merge weights = total encoded bits
    while pq.len() > 1 {
        let Reverse(a) = pq.pop().unwrap();
        let Reverse(b) = pq.pop().unwrap();
        total += a + b;
        pq.push(Reverse(a + b));
    }

    assert_eq!(total, 224); // optimal weighted path length for these frequencies
}
