// Divide and conquer: maximum-subarray sum.
class Main {
    static int maxSub(int[] a, int lo, int hi) {
        if (lo == hi) return a[lo];
        int mid = (lo + hi) / 2;
        int left = maxSub(a, lo, mid), right = maxSub(a, mid + 1, hi);
        int s = 0, lbest = Integer.MIN_VALUE;
        for (int i = mid; i >= lo; i--) { s += a[i]; lbest = Math.max(lbest, s); }
        s = 0; int rbest = Integer.MIN_VALUE;
        for (int i = mid + 1; i <= hi; i++) { s += a[i]; rbest = Math.max(rbest, s); }
        return Math.max(left, Math.max(right, lbest + rbest));
    }

    public static void main(String[] args) {
        int[] a = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        assert maxSub(a, 0, a.length - 1) == 6;     // subarray [4, -1, 2, 1]
        System.out.println("ok");
    }
}
