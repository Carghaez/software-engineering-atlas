// Recursive depth-first search over an adjacency list; records visit order.
fn dfs(g: &[Vec<usize>], u: usize, visited: &mut [bool], order: &mut Vec<usize>) {
    visited[u] = true;
    order.push(u);
    for i in 0..g[u].len() {
        let v = g[u][i];
        if !visited[v] {
            dfs(g, v, visited, order);
        }
    }
}

fn main() {
    let g: Vec<Vec<usize>> = vec![vec![1, 2], vec![0, 3], vec![0, 3], vec![1, 2, 4], vec![3, 5], vec![4]];
    let mut visited = vec![false; g.len()];
    let mut order = Vec::new();
    dfs(&g, 0, &mut visited, &mut order);

    assert_eq!(order.len(), g.len());
    assert_eq!(order[0], 0);
    assert!(visited.iter().all(|&b| b));
}
