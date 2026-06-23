// 2-D k-d tree: build by median split, then nearest-neighbour query.
struct Node {
    p: [i32; 2],
    axis: usize,
    l: Option<Box<Node>>,
    r: Option<Box<Node>>,
}

fn build(pts: &mut [[i32; 2]], depth: usize) -> Option<Box<Node>> {
    if pts.is_empty() {
        return None;
    }
    let axis = depth % 2;
    pts.sort_by_key(|p| p[axis]);
    let mid = pts.len() / 2;
    let (left, rest) = pts.split_at_mut(mid);
    let (mid_pt, right) = rest.split_first_mut().unwrap();
    Some(Box::new(Node {
        p: *mid_pt,
        axis,
        l: build(left, depth + 1),
        r: build(right, depth + 1),
    }))
}

fn d2(a: &[i32; 2], b: &[i32; 2]) -> i64 {
    let (dx, dy) = ((a[0] - b[0]) as i64, (a[1] - b[1]) as i64);
    dx * dx + dy * dy
}

fn nearest(node: &Option<Box<Node>>, q: &[i32; 2], best: &mut [i32; 2], bd: &mut i64) {
    if let Some(n) = node {
        let dd = d2(&n.p, q);
        if dd < *bd {
            *bd = dd;
            *best = n.p;
        }
        let diff = (q[n.axis] - n.p[n.axis]) as i64;
        let (first, second) = if diff < 0 { (&n.l, &n.r) } else { (&n.r, &n.l) };
        nearest(first, q, best, bd);
        if diff * diff < *bd {
            nearest(second, q, best, bd);
        }
    }
}

fn main() {
    let mut pts = [[2, 3], [5, 4], [9, 6], [4, 7], [8, 1], [7, 2]];
    let root = build(&mut pts, 0);
    let q = [9, 2];
    let (mut best, mut bd) = ([0, 0], i64::MAX);
    nearest(&root, &q, &mut best, &mut bd);
    assert_eq!(best, [8, 1]); // nearest point to (9,2)
}
