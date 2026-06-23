// Idiomatic double-ended queue in Rust: std::collections::VecDeque.
use std::collections::VecDeque;

fn main() {
    let mut d: VecDeque<i32> = VecDeque::new();
    d.push_back(1);
    d.push_front(2);
    d.push_back(3); // -> [2, 1, 3]
    assert_eq!(d.front(), Some(&2));
    assert_eq!(d.back(), Some(&3));
    assert_eq!(d.len(), 3);
    d.pop_front();
    assert_eq!(d.front(), Some(&1));
    d.pop_back();
    assert_eq!(d.back(), Some(&1));
}
