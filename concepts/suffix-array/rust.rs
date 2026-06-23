// Suffix array of "banana" by sorting suffix start indices (naive comparator).
fn main() {
    let s = b"banana";
    let n = s.len();
    let mut sa: Vec<usize> = (0..n).collect();
    sa.sort_by(|&a, &b| s[a..].cmp(&s[b..])); // compare whole suffixes

    assert_eq!(sa, vec![5, 3, 1, 0, 4, 2]); // a, ana, anana, banana, na, nana
}
