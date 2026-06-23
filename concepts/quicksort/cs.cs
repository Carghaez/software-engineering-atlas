// Quicksort (Lomuto partition), in place, on an int array.
int[] a = { 5, 2, 9, 1, 5, 6, 3, 8, 7, 0 };
Quicksort(a, 0, a.Length - 1);

for (int k = 1; k < a.Length; k++) Check(a[k - 1] <= a[k], "sorted");
Check(a[0] == 0 && a[^1] == 9, "extremes");

static void Quicksort(int[] a, int lo, int hi)
{
    if (lo >= hi) return;
    int pivot = a[hi], i = lo;                  // last element as pivot
    for (int j = lo; j < hi; j++)
        if (a[j] < pivot) { (a[i], a[j]) = (a[j], a[i]); i++; }
    (a[i], a[hi]) = (a[hi], a[i]);              // pivot to its sorted position
    Quicksort(a, lo, i - 1);
    Quicksort(a, i + 1, hi);
}

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
