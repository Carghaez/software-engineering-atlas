// Quicksort (Lomuto partition), in place, on a slice.
fn quicksort(a: &mut [i32]) {
    if a.len() <= 1 {
        return;
    }
    let pivot = a.len() - 1;
    let mut i = 0;
    for j in 0..pivot {
        if a[j] < a[pivot] {
            a.swap(i, j);
            i += 1;
        }
    }
    a.swap(i, pivot); // pivot to its sorted position
    let (left, right) = a.split_at_mut(i);
    quicksort(left);
    quicksort(&mut right[1..]); // skip the pivot, now in place
}

fn main() {
    let mut a = [5, 2, 9, 1, 5, 6, 3, 8, 7, 0];
    quicksort(&mut a);
    assert!(a.windows(2).all(|w| w[0] <= w[1]));
    assert_eq!(a[0], 0);
    assert_eq!(a[9], 9);
}
