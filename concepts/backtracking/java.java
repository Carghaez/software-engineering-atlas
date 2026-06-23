// Backtracking: count solutions to the 8-queens puzzle.
class Main {
    static int n = 8, solutions = 0;
    static int[] cols;

    static boolean safe(int row, int col) {
        for (int r = 0; r < row; r++) {
            int c = cols[r];
            if (c == col || r - c == row - col || r + c == row + col) return false;
        }
        return true;
    }

    static void solve(int row) {
        if (row == n) { solutions++; return; }
        for (int col = 0; col < n; col++)
            if (safe(row, col)) { cols[row] = col; solve(row + 1); }
    }

    public static void main(String[] args) {
        cols = new int[n];
        solve(0);
        assert solutions == 92;
        System.out.println(solutions);
    }
}
