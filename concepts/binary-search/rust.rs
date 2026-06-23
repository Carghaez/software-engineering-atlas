// Idiomatic binary search in Rust: slice::binary_search on a sorted slice.
fn main() {
    let a = [1, 3, 4, 7, 9, 11, 15];

    assert_eq!(a.binary_search(&7), Ok(3));
    assert_eq!(a.binary_search(&1), Ok(0));
    assert_eq!(a.binary_search(&15), Ok(6));

    // A miss returns Err(insertion_point), the index that keeps it sorted.
    assert_eq!(a.binary_search(&8), Err(4));
}
