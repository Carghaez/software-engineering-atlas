// Idiomatic dynamic array in Rust: the standard library's `Vec<T>`.

fn main() {
    let mut v: Vec<i32> = Vec::new();

    // Amortised O(1) append — the Vec doubles its capacity on growth.
    for i in 0..10 {
        v.push(i * i);
    }

    // O(1) indexed access and length.
    println!("len = {}, third = {}", v.len(), v[2]);

    // Reserve up front to avoid intermediate reallocations on a known size.
    let mut squares = Vec::with_capacity(10);
    squares.extend((0..10).map(|i| i * i));
    assert_eq!(squares.len(), 10);
}
