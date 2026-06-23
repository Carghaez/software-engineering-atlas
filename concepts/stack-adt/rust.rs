// Idiomatic stack ADT in Rust: Vec used as a LIFO stack.
fn main() {
    let mut s: Vec<i32> = Vec::new();
    for i in 1..=3 {
        s.push(i);
    }

    assert_eq!(s.last(), Some(&3)); // last in, first out
    assert_eq!(s.pop(), Some(3));
    assert_eq!(s.pop(), Some(2));
    assert_eq!(s.pop(), Some(1));
    assert!(s.is_empty());
}
