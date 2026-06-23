// Gradient descent minimising f(x) = (x-3)^2 toward its minimum at x = 3.
fn main() {
    let mut x = 0.0_f64;
    let lr = 0.1;
    for _ in 0..200 {
        let grad = 2.0 * (x - 3.0); // d/dx (x-3)^2
        x -= lr * grad; // step opposite the gradient
    }
    assert!((x - 3.0).abs() < 1e-6); // converged to the minimum
}
