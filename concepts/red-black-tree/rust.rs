// Rust's standard ordered map is BTreeMap — a B-tree filling the same
// ordered-map role a red-black tree does in other standard libraries.
use std::collections::BTreeMap;

fn main() {
    let mut m = BTreeMap::new();
    for (k, v) in [(5, "e"), (1, "a"), (3, "c"), (2, "b"), (4, "d")] {
        m.insert(k, v);
    }

    let keys: Vec<i32> = m.keys().copied().collect(); // iterates sorted
    assert_eq!(keys, vec![1, 2, 3, 4, 5]);
    assert_eq!(m[&3], "c");
    assert_eq!(m.range(3..).next().unwrap().0, &3); // ordered range query
}
