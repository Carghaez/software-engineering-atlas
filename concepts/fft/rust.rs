// Recursive radix-2 Cooley-Tukey FFT (own complex type); FFT->IFFT roundtrip.
#[derive(Clone, Copy)]
struct C {
    re: f64,
    im: f64,
}
impl C {
    fn add(self, o: C) -> C { C { re: self.re + o.re, im: self.im + o.im } }
    fn sub(self, o: C) -> C { C { re: self.re - o.re, im: self.im - o.im } }
    fn mul(self, o: C) -> C {
        C { re: self.re * o.re - self.im * o.im, im: self.re * o.im + self.im * o.re }
    }
}

fn fft(a: &mut Vec<C>, inv: bool) {
    let n = a.len();
    if n <= 1 {
        return;
    }
    let mut even: Vec<C> = (0..n / 2).map(|i| a[2 * i]).collect();
    let mut odd: Vec<C> = (0..n / 2).map(|i| a[2 * i + 1]).collect();
    fft(&mut even, inv);
    fft(&mut odd, inv);
    let sign = if inv { 2.0 } else { -2.0 };
    for k in 0..n / 2 {
        let ang = sign * std::f64::consts::PI * k as f64 / n as f64;
        let w = C { re: ang.cos(), im: ang.sin() }.mul(odd[k]);
        a[k] = even[k].add(w);
        a[k + n / 2] = even[k].sub(w);
    }
}

fn main() {
    let mut a: Vec<C> = (1..=8).map(|i| C { re: i as f64, im: 0.0 }).collect();
    let orig = a.clone();
    fft(&mut a, false); // forward
    fft(&mut a, true); // inverse
    let n = a.len() as f64;
    for i in 0..a.len() {
        let (re, im) = (a[i].re / n - orig[i].re, a[i].im / n - orig[i].im);
        assert!((re * re + im * im).sqrt() < 1e-9);
    }
}
