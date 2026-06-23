// Divide and conquer: maximum-subarray sum.
int[] a = { -2, 1, -3, 4, -1, 2, 1, -5, 4 };
Check(MaxSub(a, 0, a.Length - 1) == 6, "max subarray");      // subarray [4, -1, 2, 1]

static int MaxSub(int[] a, int lo, int hi)
{
    if (lo == hi) return a[lo];
    int mid = (lo + hi) / 2;
    int left = MaxSub(a, lo, mid), right = MaxSub(a, mid + 1, hi);
    int s = 0, lbest = int.MinValue;
    for (int i = mid; i >= lo; i--) { s += a[i]; lbest = Math.Max(lbest, s); }
    s = 0; int rbest = int.MinValue;
    for (int i = mid + 1; i <= hi; i++) { s += a[i]; rbest = Math.Max(rbest, s); }
    return Math.Max(left, Math.Max(right, lbest + rbest));
}

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
