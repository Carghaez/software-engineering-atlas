// DPLL-style SAT: backtracking with early conflict checks decides satisfiability of a CNF.
class Main {
    static int[] val = new int[8];   // 0 unassigned, 1 true, -1 false

    static boolean conflict(int[][] cl) {   // a clause is violated only if every literal is false
        for (int[] c : cl) {
            boolean allFalse = true;
            for (int lit : c) {
                int v = lit > 0 ? lit : -lit;
                if (val[v] == 0 || (val[v] == 1) == (lit > 0)) { allFalse = false; break; }
            }
            if (allFalse) return true;
        }
        return false;
    }
    static boolean solve(int[][] cl, int var, int nv) {
        if (conflict(cl)) return false;
        if (var > nv) return true;       // all assigned, no conflict -> SAT
        for (int b = 1; b >= -1; b -= 2) { val[var] = b; if (solve(cl, var + 1, nv)) return true; }
        val[var] = 0;
        return false;
    }
    static boolean sat(int[][] cl, int nv) { java.util.Arrays.fill(val, 0); return solve(cl, 1, nv); }

    public static void main(String[] args) {
        int[][] ok  = {{1, 2}, {-1, 3}, {-2, -3}};   // (x1|x2)&(~x1|x3)&(~x2|~x3)
        int[][] bad = {{1}, {-1}};                    // x1 & ~x1 -> UNSAT
        assert sat(ok, 3);
        assert !sat(bad, 1);
        System.out.println("ok");
    }
}
