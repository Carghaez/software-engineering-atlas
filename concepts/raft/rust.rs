// Raft leader election: vote-once-per-term makes quorums intersect, so a term has one leader.
const N: usize = 5;

fn request_votes(voted_for: &mut [i32; N], candidate: i32, peers: &[usize]) -> usize {
    let mut votes = 1; // a candidate votes for itself
    for &p in peers {
        if voted_for[p] == -1 {
            voted_for[p] = candidate;
            votes += 1;
        }
    }
    votes
}

fn main() {
    let mut voted_for = [-1i32; N];
    let a = request_votes(&mut voted_for, 0, &[1, 2]); // node 0 courts {1,2}
    let b = request_votes(&mut voted_for, 3, &[2, 4]); // node 3 courts {2,4}; node 2 voted for 0
    assert!(a == 3 && a >= N / 2 + 1); // majority -> 0 is leader for the term
    assert!(b == 2 && b < N / 2 + 1); // 3 falls short: quorums overlapped at node 2
}
