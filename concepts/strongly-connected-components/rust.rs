// Strongly connected components via Kosaraju's two-pass DFS.
fn dfs1(u: usize, g: &[Vec<usize>], vis: &mut [bool], order: &mut Vec<usize>) {
    vis[u] = true;
    for &v in &g[u] {
        if !vis[v] {
            dfs1(v, g, vis, order);
        }
    }
    order.push(u);
}

fn dfs2(u: usize, gt: &[Vec<usize>], comp: &mut [i32], c: i32) {
    comp[u] = c;
    for &v in &gt[u] {
        if comp[v] < 0 {
            dfs2(v, gt, comp, c);
        }
    }
}

fn main() {
    let n = 5;
    let edges = [(1, 0), (0, 2), (2, 1), (0, 3), (3, 4)];
    let mut g = vec![Vec::new(); n];
    let mut gt = vec![Vec::new(); n];
    for &(u, v) in &edges {
        g[u].push(v);
        gt[v].push(u);
    }

    let mut vis = vec![false; n];
    let mut order = Vec::new();
    for i in 0..n {
        if !vis[i] {
            dfs1(i, &g, &mut vis, &mut order);
        }
    }
    let mut comp = vec![-1; n];
    let mut c = 0;
    for &u in order.iter().rev() {
        if comp[u] < 0 {
            dfs2(u, &gt, &mut comp, c);
            c += 1;
        }
    }

    assert_eq!(c, 3);
    assert!(comp[0] == comp[1] && comp[1] == comp[2]);
    assert!(comp[3] != comp[0] && comp[4] != comp[3]);
}
