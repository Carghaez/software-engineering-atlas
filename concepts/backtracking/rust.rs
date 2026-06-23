// Backtracking: count solutions to the 8-queens puzzle.
fn safe(cols: &[usize], row: usize, col: usize) -> bool {
    for r in 0..row {
        let c = cols[r];
        if c == col
            || (r as i32 - c as i32) == (row as i32 - col as i32)
            || (r + c) == (row + col)
        {
            return false;
        }
    }
    true
}

fn solve(cols: &mut [usize], row: usize, n: usize, count: &mut u32) {
    if row == n {
        *count += 1;
        return;
    }
    for col in 0..n {
        if safe(cols, row, col) {
            cols[row] = col;
            solve(cols, row + 1, n, count);
        }
    }
}

fn main() {
    let n = 8;
    let mut cols = vec![0usize; n];
    let mut count = 0;
    solve(&mut cols, 0, n, &mut count);
    assert_eq!(count, 92);
}
