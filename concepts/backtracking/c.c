// Backtracking: count solutions to the 8-queens puzzle.
#include <assert.h>

#define N 8
int cols[N], count;

int safe(int row, int col) {
    for (int r = 0; r < row; r++) {
        int c = cols[r];
        if (c == col || r - c == row - col || r + c == row + col) return 0;
    }
    return 1;
}

void solve(int row) {
    if (row == N) { count++; return; }
    for (int col = 0; col < N; col++)
        if (safe(row, col)) { cols[row] = col; solve(row + 1); }   // choose / recurse
}

int main(void) {
    solve(0);
    assert(count == 92);        // the 8-queens puzzle has 92 solutions
    return 0;
}
