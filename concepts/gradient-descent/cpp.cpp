// Gradient descent minimising f(x) = (x-3)^2 toward its minimum at x = 3.
#include <cmath>
#include <cassert>

int main() {
    double x = 0.0, lr = 0.1;
    for (int it = 0; it < 200; it++) {
        double grad = 2.0 * (x - 3.0);     // d/dx (x-3)^2
        x -= lr * grad;                    // step opposite the gradient
    }
    assert(std::abs(x - 3.0) < 1e-6);      // converged to the minimum
    return 0;
}
