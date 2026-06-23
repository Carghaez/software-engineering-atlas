// Top-down merge sort in Rust: split, recurse, merge two sorted halves.
fn merge_sort(a: &[i32]) -> Vec<i32> {
    if a.len() <= 1 {
        return a.to_vec();
    }
    let mid = a.len() / 2;
    let left = merge_sort(&a[..mid]);
    let right = merge_sort(&a[mid..]);

    let mut out = Vec::with_capacity(a.len());
    let (mut i, mut j) = (0, 0);
    while i < left.len() && j < right.len() {
        if left[i] <= right[j] {
            out.push(left[i]);
            i += 1;
        } else {
            out.push(right[j]);
            j += 1;
        }
    }
    out.extend_from_slice(&left[i..]);
    out.extend_from_slice(&right[j..]);
    out
}

fn main() {
    let a = [5, 2, 9, 1, 5, 6, 3, 8, 7, 0];
    let s = merge_sort(&a);
    assert!(s.windows(2).all(|w| w[0] <= w[1]));
    assert_eq!(s.first(), Some(&0));
    assert_eq!(s.last(), Some(&9));
}
