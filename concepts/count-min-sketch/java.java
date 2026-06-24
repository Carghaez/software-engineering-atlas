// Count-Min Sketch: d hashes into a d x w counter grid; query returns the min (overestimates only).
class Main {
    static final int D = 4, W = 16;
    static int[][] c = new int[D][W];

    static int h(String s, int row) { return Math.floorMod((s + "#" + row).hashCode(), W); }
    static void add(String s) { for (int r = 0; r < D; r++) c[r][h(s, r)]++; }
    static int est(String s) {
        int m = Integer.MAX_VALUE;
        for (int r = 0; r < D; r++) m = Math.min(m, c[r][h(s, r)]);
        return m;
    }

    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) add("apple");
        for (int i = 0; i < 2; i++) add("banana");
        assert est("apple") >= 5;    // never underestimates the true count
        assert est("banana") >= 2;
        assert est("cherry") >= 0;   // unseen item: 0 or a collision overcount
        System.out.println("ok");
    }
}
