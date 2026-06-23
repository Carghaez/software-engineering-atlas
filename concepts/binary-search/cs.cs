// Idiomatic binary search in C#: Array.BinarySearch over a sorted array.
int[] a = { 1, 3, 4, 7, 9, 11, 15 };

Check(Array.BinarySearch(a, 7) == 3, "found 7");
Check(Array.BinarySearch(a, 1) == 0, "found first");
Check(Array.BinarySearch(a, 15) == 6, "found last");

// A miss returns the bitwise complement of the insertion point.
int miss = Array.BinarySearch(a, 8);
Check(miss < 0 && ~miss == 4, "insertion point");

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
