// Streaming algorithms: a single pass in O(1) memory. Boyer-Moore majority vote over a stream.
fn majority(stream: &[i32]) -> i32 {
    let (mut cand, mut count) = (0, 0i32); // one candidate, one counter — constant memory
    for &x in stream {
        if count == 0 {
            cand = x;
        }
        count += if x == cand { 1 } else { -1 };
    }
    cand // the >n/2 element, if one exists
}

fn main() {
    let stream = [3, 3, 4, 2, 3, 3, 5, 3, 3]; // 3 appears 6 of 9 times
    let m = majority(&stream);
    let seen = stream.iter().filter(|&&x| x == m).count();
    assert!(m == 3 && seen * 2 > stream.len()); // verified majority in one pass
}
