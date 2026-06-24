// Arithmetic coding: narrow [low,high) by each symbol's probability slice; a point in it decodes back.
// model for symbols A,B,C: cumulative ranges [0,0.5), [0.5,0.8), [0.8,1.0)
const LO: [f64; 3] = [0.0, 0.5, 0.8];
const HI: [f64; 3] = [0.5, 0.8, 1.0];

fn encode(msg: &[usize]) -> f64 {
    let (mut low, mut high) = (0.0f64, 1.0f64);
    for &s in msg {
        let r = high - low;
        high = low + r * HI[s];
        low += r * LO[s];
    }
    (low + high) / 2.0 // any point inside the final interval identifies the message
}

fn decode(code: f64, n: usize) -> Vec<usize> {
    let (mut low, mut high) = (0.0f64, 1.0f64);
    let mut out = vec![];
    for _ in 0..n {
        let r = high - low;
        let v = (code - low) / r;
        let s = if v < HI[0] { 0 } else if v < HI[1] { 1 } else { 2 };
        out.push(s);
        high = low + r * HI[s];
        low += r * LO[s];
    }
    out
}

fn main() {
    let msg = vec![0usize, 1, 2, 0, 1]; // A B C A B
    let code = encode(&msg);
    assert_eq!(decode(code, msg.len()), msg); // round-trips exactly
    assert!(code > 0.0 && code < 1.0);
}
