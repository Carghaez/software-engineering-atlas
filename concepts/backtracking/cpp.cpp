// Backtracking: count solutions to the 8-queens puzzle.
#include <vector>
#include <cassert>

int n = 8, solutions = 0;
std::vector<int> cols;

bool safe(int row, int col) {
    for (int r = 0; r < row; r++) {
        int c = cols[r];
        if (c == col || r - c == row - col || r + c == row + col) return false;
    }
    return true;
}

void solve(int row) {
    if (row == n) { solutions++; return; }
    for (int col = 0; col < n; col++)
        if (safe(row, col)) { cols[row] = col; solve(row + 1); }
}

int main() {
    cols.assign(n, 0);
    solve(0);
    assert(solutions == 92);
    return 0;
}
