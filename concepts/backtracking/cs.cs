// Backtracking: count solutions to the 8-queens puzzle.
int n = 8, solutions = 0;
var cols = new int[n];

bool Safe(int row, int col)
{
    for (int r = 0; r < row; r++)
    {
        int c = cols[r];
        if (c == col || r - c == row - col || r + c == row + col) return false;
    }
    return true;
}

void Solve(int row)
{
    if (row == n) { solutions++; return; }
    for (int col = 0; col < n; col++)
        if (Safe(row, col)) { cols[row] = col; Solve(row + 1); }
}

Solve(0);
Check(solutions == 92, "8-queens solutions");

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
