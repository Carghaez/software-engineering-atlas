// Top-down merge sort in C#: split, recurse, merge two sorted halves.
int[] a = { 5, 2, 9, 1, 5, 6, 3, 8, 7, 0 };
int[] sorted = MergeSort(a);

for (int k = 1; k < sorted.Length; k++) Check(sorted[k - 1] <= sorted[k], "sorted");
Check(sorted[0] == 0 && sorted[^1] == 9, "extremes");

static int[] MergeSort(int[] a)
{
    if (a.Length <= 1) return a;
    int mid = a.Length / 2;
    int[] left = MergeSort(a[..mid]);
    int[] right = MergeSort(a[mid..]);
    var outp = new int[a.Length];
    int i = 0, j = 0, k = 0;
    while (i < left.Length && j < right.Length)
        outp[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    while (i < left.Length) outp[k++] = left[i++];
    while (j < right.Length) outp[k++] = right[j++];
    return outp;
}

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
