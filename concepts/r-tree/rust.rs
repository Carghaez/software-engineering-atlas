// R-tree: data rectangles grouped under minimum bounding rectangles; a window query skips non-overlapping MBRs.
#[derive(Clone, Copy)]
struct Rect { x0: f32, y0: f32, x1: f32, y1: f32 }

fn overlap(a: &Rect, b: &Rect) -> bool {
    a.x0 <= b.x1 && b.x0 <= a.x1 && a.y0 <= b.y1 && b.y0 <= a.y1
}

struct Node { mbr: Rect, entries: Vec<(Rect, i32)> }

fn query(tree: &[Node], w: &Rect, probes: &mut u32) -> Vec<i32> {
    let mut hits = vec![];
    for n in tree {
        if !overlap(&n.mbr, w) { continue; } // prune the whole node by its MBR
        for (b, id) in &n.entries {
            *probes += 1;
            if overlap(b, w) { hits.push(*id); }
        }
    }
    hits
}

fn main() {
    let r = |x0, y0, x1, y1| Rect { x0, y0, x1, y1 };
    let tree = vec![
        Node { mbr: r(0.0, 0.0, 3.0, 3.0), entries: vec![(r(0.0, 0.0, 1.0, 1.0), 0), (r(2.0, 2.0, 3.0, 3.0), 1)] },
        Node { mbr: r(5.0, 5.0, 8.0, 8.0), entries: vec![(r(5.0, 5.0, 6.0, 6.0), 2), (r(7.0, 7.0, 8.0, 8.0), 3)] },
    ];
    let mut probes = 0;
    let hits = query(&tree, &r(0.5, 0.5, 2.5, 2.5), &mut probes); // window near the origin
    assert_eq!(hits, vec![0, 1]);
    assert_eq!(probes, 2); // only the left node's entries probed; right MBR pruned
}
