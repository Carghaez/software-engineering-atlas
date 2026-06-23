// A* shortest path on a 4-connected grid (Manhattan heuristic).
use std::cmp::Reverse;
use std::collections::BinaryHeap;

fn main() {
    let grid = [
        [0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0],
    ];
    let (rows, cols, gr, gc) = (5i32, 5i32, 4i32, 0i32);
    let h = |r: i32, c: i32| (r - gr).abs() + (c - gc).abs();

    let mut g = vec![vec![i32::MAX; 5]; 5];
    let mut pq = BinaryHeap::new(); // min-heap on f via Reverse
    g[0][0] = 0;
    pq.push(Reverse((h(0, 0), 0i32, 0i32))); // (f, r, c)
    let dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)];
    let mut ans = -1;
    while let Some(Reverse((_f, r, c))) = pq.pop() {
        if r == gr && c == gc {
            ans = g[r as usize][c as usize];
            break;
        }
        for (dx, dy) in dirs {
            let (nr, nc) = (r + dx, c + dy);
            if nr < 0 || nr >= rows || nc < 0 || nc >= cols || grid[nr as usize][nc as usize] == 1 {
                continue;
            }
            let ng = g[r as usize][c as usize] + 1;
            if ng < g[nr as usize][nc as usize] {
                g[nr as usize][nc as usize] = ng;
                pq.push(Reverse((ng + h(nr, nc), nr, nc)));
            }
        }
    }
    assert_eq!(ans, 12);
}
