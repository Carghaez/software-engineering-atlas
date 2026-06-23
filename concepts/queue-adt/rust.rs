// Idiomatic queue ADT in Rust: std::collections::VecDeque (FIFO).
use std::collections::VecDeque;

fn main() {
    let mut q: VecDeque<i32> = VecDeque::new();
    for i in 1..=3 {
        q.push_back(i);
    }

    assert_eq!(q.front(), Some(&1)); // first in, first out
    assert_eq!(q.pop_front(), Some(1));
    assert_eq!(q.pop_front(), Some(2));
    assert_eq!(q.pop_front(), Some(3));
    assert!(q.is_empty());
}
