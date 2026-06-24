// HyperLogLog: per-register leading-zero maxima -> harmonic-mean cardinality estimate.
class Main {
    static long mix(long x) {                 // splitmix64 finalizer: well-spread hash
        x += 0x9e3779b97f4a7c15L;
        x = (x ^ (x >>> 30)) * 0xbf58476d1ce4e5b9L;
        x = (x ^ (x >>> 27)) * 0x94d049bb133111ebL;
        return x ^ (x >>> 31);
    }

    public static void main(String[] args) {
        int p = 10, m = 1 << p;               // 1024 registers
        int[] reg = new int[m];
        for (long i = 0; i < 5000; i++) {     // 5000 distinct items
            long h = mix(i);
            int idx = (int) (h >>> (64 - p));
            long w = (h << p) | (1L << (p - 1));   // sentinel bounds the run
            int rho = Long.numberOfLeadingZeros(w) + 1;
            if (rho > reg[idx]) reg[idx] = rho;
        }
        double Z = 0;
        for (int r : reg) Z += Math.pow(2.0, -r);
        double alpha = 0.7213 / (1.0 + 1.079 / m);
        double est = alpha * m * m / Z;
        assert est > 4500 && est < 5500;      // within ~10% of 5000 true distinct
        System.out.println("ok");
    }
}
