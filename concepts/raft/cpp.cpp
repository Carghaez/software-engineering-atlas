// Raft leader election: vote-once-per-term makes quorums intersect, so a term has one leader.
#include <array>
#include <vector>
#include <cassert>

const int N = 5;
std::array<int, N> votedFor;   // per current term; -1 = not yet voted

int requestVotes(int candidate, const std::vector<int>& peers) {
    int votes = 1;                         // a candidate votes for itself
    for (int p : peers)
        if (votedFor[p] == -1) { votedFor[p] = candidate; votes++; }
    return votes;
}

int main() {
    votedFor.fill(-1);
    int a = requestVotes(0, {1, 2});       // node 0 courts {1,2}
    int b = requestVotes(3, {2, 4});       // node 3 courts {2,4}; node 2 already voted for 0
    assert(a == 3 && a >= N / 2 + 1);      // majority -> 0 is leader for the term
    assert(b == 2 && b <  N / 2 + 1);      // 3 falls short: quorums overlapped at node 2
    return 0;
}
