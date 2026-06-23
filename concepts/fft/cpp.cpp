// Recursive radix-2 Cooley-Tukey FFT; verified by an FFT->IFFT roundtrip.
#include <complex>
#include <vector>
#include <cassert>

using cd = std::complex<double>;
const double PI = 3.14159265358979323846;

void fft(std::vector<cd>& a, bool inv) {
    int n = (int)a.size();
    if (n <= 1) return;
    std::vector<cd> even(n / 2), odd(n / 2);
    for (int i = 0; i < n / 2; i++) { even[i] = a[2 * i]; odd[i] = a[2 * i + 1]; }
    fft(even, inv);
    fft(odd, inv);
    for (int k = 0; k < n / 2; k++) {
        cd w = std::polar(1.0, (inv ? 2 : -2) * PI * k / n) * odd[k];   // twiddle * odd
        a[k] = even[k] + w;
        a[k + n / 2] = even[k] - w;
    }
}

int main() {
    std::vector<cd> a = {1, 2, 3, 4, 5, 6, 7, 8}, orig = a;
    fft(a, false);                                      // forward
    fft(a, true);                                       // inverse
    for (auto& x : a) x /= (double)a.size();
    for (size_t i = 0; i < a.size(); i++) assert(std::abs(a[i] - orig[i]) < 1e-9);
    return 0;
}
