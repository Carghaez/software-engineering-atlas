// k-means (Lloyd's iteration) on 2-D points, k = 2.
fn main() {
    let pts: [[f64; 2]; 8] = [
        [0.0, 0.0], [1.0, 0.0], [0.0, 1.0], [1.0, 1.0],
        [10.0, 10.0], [11.0, 10.0], [10.0, 11.0], [11.0, 11.0],
    ];
    let mut c: [[f64; 2]; 2] = [[0.0, 0.0], [10.0, 10.0]]; // initial centroids
    let mut assign = [0usize; 8];

    for _ in 0..10 {
        for (i, p) in pts.iter().enumerate() {
            // assignment step
            let d0 = (p[0] - c[0][0]).hypot(p[1] - c[0][1]);
            let d1 = (p[0] - c[1][0]).hypot(p[1] - c[1][1]);
            assign[i] = if d0 <= d1 { 0 } else { 1 };
        }
        let (mut sx, mut sy, mut cnt) = ([0.0; 2], [0.0; 2], [0usize; 2]); // update step
        for (i, p) in pts.iter().enumerate() {
            let k = assign[i];
            sx[k] += p[0];
            sy[k] += p[1];
            cnt[k] += 1;
        }
        for k in 0..2 {
            if cnt[k] > 0 {
                c[k][0] = sx[k] / cnt[k] as f64;
                c[k][1] = sy[k] / cnt[k] as f64;
            }
        }
    }

    for i in 0..4 {
        assert_eq!(assign[i], assign[0]);
    }
    for i in 4..8 {
        assert_eq!(assign[i], assign[4]);
    }
    assert_ne!(assign[0], assign[4]);
}
