// k-means (Lloyd's iteration) on 2-D points, k = 2.
class Main {
    public static void main(String[] a) {
        double[][] pts = {{0,0},{1,0},{0,1},{1,1}, {10,10},{11,10},{10,11},{11,11}};
        double[][] c = {{0, 0}, {10, 10}};               // initial centroids
        int[] assign = new int[pts.length];

        for (int it = 0; it < 10; it++) {
            for (int i = 0; i < pts.length; i++) {       // assignment step
                double d0 = Math.hypot(pts[i][0] - c[0][0], pts[i][1] - c[0][1]);
                double d1 = Math.hypot(pts[i][0] - c[1][0], pts[i][1] - c[1][1]);
                assign[i] = d0 <= d1 ? 0 : 1;
            }
            double[] sx = {0, 0}, sy = {0, 0}; int[] cnt = {0, 0};   // update step
            for (int i = 0; i < pts.length; i++) { int k = assign[i]; sx[k] += pts[i][0]; sy[k] += pts[i][1]; cnt[k]++; }
            for (int k = 0; k < 2; k++) if (cnt[k] > 0) { c[k][0] = sx[k] / cnt[k]; c[k][1] = sy[k] / cnt[k]; }
        }

        for (int i = 0; i < 4; i++) assert assign[i] == assign[0];
        for (int i = 4; i < 8; i++) assert assign[i] == assign[4];
        assert assign[0] != assign[4];
        System.out.println("ok");
    }
}
