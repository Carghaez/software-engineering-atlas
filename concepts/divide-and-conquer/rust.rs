// Divide and conquer: maximum-subarray sum.
fn max_sub(a: &[i32], lo: usize, hi: usize) -> i32 {
    if lo == hi {
        return a[lo];
    }
    let mid = (lo + hi) / 2;
    let left = max_sub(a, lo, mid);
    let right = max_sub(a, mid + 1, hi);

    let (mut s, mut lbest) = (0, i32::MIN);
    let mut i = mid as isize;
    while i >= lo as isize {
        s += a[i as usize];
        lbest = lbest.max(s);
        i -= 1;
    }
    let (mut r, mut rbest) = (0, i32::MIN);
    for j in (mid + 1)..=hi {
        r += a[j];
        rbest = rbest.max(r);
    }
    left.max(right).max(lbest + rbest)
}

fn main() {
    let a = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
    assert_eq!(max_sub(&a, 0, a.len() - 1), 6); // subarray [4, -1, 2, 1]
}
