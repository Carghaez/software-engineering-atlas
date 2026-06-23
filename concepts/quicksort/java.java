// Quicksort (Lomuto partition), in place, on an int array.
import java.util.Arrays;

class Main {
    static void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    static void quicksort(int[] a, int lo, int hi) {
        if (lo >= hi) return;
        int pivot = a[hi], i = lo;             // last element as pivot
        for (int j = lo; j < hi; j++)
            if (a[j] < pivot) swap(a, i++, j);
        swap(a, i, hi);                        // pivot to its sorted position
        quicksort(a, lo, i - 1);
        quicksort(a, i + 1, hi);
    }

    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1, 5, 6, 3, 8, 7, 0};
        quicksort(a, 0, a.length - 1);
        for (int k = 1; k < a.length; k++) assert a[k - 1] <= a[k];
        assert a[0] == 0 && a[a.length - 1] == 9;
        System.out.println(Arrays.toString(a));
    }
}
