// Idiomatic hash table in Rust: std::collections::HashMap.
use std::collections::HashMap;

fn main() {
    let mut counts: HashMap<&str, i32> = HashMap::new();

    // The entry API gives average O(1) insert-or-update without a double lookup.
    for w in ["a", "b", "a", "c", "a", "b"] {
        *counts.entry(w).or_insert(0) += 1;
    }

    assert_eq!(counts.len(), 3);
    assert_eq!(counts["a"], 3);
    assert_eq!(counts.get("b"), Some(&2));
    assert_eq!(counts.get("z"), None); // absent key
}
