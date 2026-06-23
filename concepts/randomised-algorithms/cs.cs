// Randomised quickselect: random pivot (xorshift) -> O(n) expected k-th smallest.
ulong rng = 88172645463325252UL;
ulong Rnd() { rng ^= rng << 13; rng ^= rng >> 7; rng ^= rng << 17; return rng; }

int QuickSelect(int[] src, int k)
{
    var a = (int[])src.Clone();
    int lo = 0, hi = a.Length - 1;
    while (lo < hi)
    {
        int pi = lo + (int)(Rnd() % (ulong)(hi - lo + 1));
        (a[pi], a[hi]) = (a[hi], a[pi]);
        int store = lo;
        for (int i = lo; i < hi; i++) if (a[i] < a[hi]) { (a[i], a[store]) = (a[store], a[i]); store++; }
        (a[store], a[hi]) = (a[hi], a[store]);
        if (store == k) return a[store];
        if (store < k) lo = store + 1; else hi = store - 1;
    }
    return a[lo];
}

int[] v = { 7, 2, 9, 1, 5, 6, 3, 8, 4, 0 };
Check(QuickSelect(v, 0) == 0 && QuickSelect(v, 9) == 9 && QuickSelect(v, 5) == 5, "quickselect");

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
