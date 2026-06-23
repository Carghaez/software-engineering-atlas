// Recursive radix-2 Cooley-Tukey FFT; verified by an FFT->IFFT roundtrip.
#include <assert.h>
#include <complex.h>
#include <math.h>

#define PI 3.14159265358979323846

void fft(double complex *a, int n, int inv) {
    if (n <= 1) return;
    double complex even[n / 2], odd[n / 2];
    for (int i = 0; i < n / 2; i++) { even[i] = a[2 * i]; odd[i] = a[2 * i + 1]; }
    fft(even, n / 2, inv);
    fft(odd, n / 2, inv);
    for (int k = 0; k < n / 2; k++) {
        double ang = (inv ? 2.0 : -2.0) * PI * k / n;
        double complex w = cexp(I * ang) * odd[k];     // twiddle factor * odd term
        a[k] = even[k] + w;
        a[k + n / 2] = even[k] - w;
    }
}

int main(void) {
    int n = 8;
    double complex a[8], orig[8];
    for (int i = 0; i < n; i++) a[i] = orig[i] = i + 1;
    fft(a, n, 0);                                       // forward
    fft(a, n, 1);                                       // inverse
    for (int i = 0; i < n; i++) { a[i] /= n; assert(cabs(a[i] - orig[i]) < 1e-9); }
    return 0;
}
