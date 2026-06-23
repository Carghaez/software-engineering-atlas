// Randomised quickselect: random pivot (xorshift) -> O(n) expected k-th smallest.
class Main {
    static long rng = 88172645463325252L;
    static long rnd() { rng ^= rng << 13; rng ^= rng >>> 7; rng ^= rng << 17; return rng; }

    static int quickselect(int[] src, int k) {
        int[] a = src.clone();
        int lo = 0, hi = a.length - 1;
        while (lo < hi) {
            int pi = lo + (int) Long.remainderUnsigned(rnd(), hi - lo + 1);
            int t = a[pi]; a[pi] = a[hi]; a[hi] = t;
            int store = lo;
            for (int i = lo; i < hi; i++)
                if (a[i] < a[hi]) { int u = a[i]; a[i] = a[store]; a[store] = u; store++; }
            t = a[store]; a[store] = a[hi]; a[hi] = t;
            if (store == k) return a[store];
            if (store < k) lo = store + 1; else hi = store - 1;
        }
        return a[lo];
    }

    public static void main(String[] x) {
        int[] v = {7,2,9,1,5,6,3,8,4,0};
        assert quickselect(v, 0) == 0;
        assert quickselect(v, 9) == 9;
        assert quickselect(v, 5) == 5;
        System.out.println("ok");
    }
}
