// Top-down merge sort in Java: split, recurse, merge two sorted halves.
import java.util.Arrays;

class Main {
    static int[] mergeSort(int[] a) {
        if (a.length <= 1) return a;
        int mid = a.length / 2;
        int[] left = mergeSort(Arrays.copyOfRange(a, 0, mid));
        int[] right = mergeSort(Arrays.copyOfRange(a, mid, a.length));
        int[] out = new int[a.length];
        int i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length)
            out[k++] = left[i] <= right[j] ? left[i++] : right[j++];
        while (i < left.length) out[k++] = left[i++];
        while (j < right.length) out[k++] = right[j++];
        return out;
    }

    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1, 5, 6, 3, 8, 7, 0};
        int[] s = mergeSort(a);
        for (int k = 1; k < s.length; k++) assert s[k - 1] <= s[k];
        assert s[0] == 0 && s[s.length - 1] == 9;
        System.out.println(Arrays.toString(s));
    }
}
