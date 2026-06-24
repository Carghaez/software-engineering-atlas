// Single-decree Paxos: once a value is chosen, higher proposals adopt it — only one value is chosen.
#include <array>
#include <string>
#include <cassert>

const int N = 3;
struct Acceptor { int promised = 0, acceptedN = 0; std::string acceptedV; };
std::array<Acceptor, N> acc;

// Run prepare(n) then accept over a majority quorum; returns the value this round commits.
std::string propose(int n, std::string v, std::array<int, 2> quorum) {
    int best = 0;                          // adopt any already-accepted value (the safety rule)
    for (int i : quorum) {
        Acceptor& a = acc[i];
        if (n > a.promised) { a.promised = n; if (a.acceptedN > best) { best = a.acceptedN; v = a.acceptedV; } }
    }
    for (int i : quorum) {
        Acceptor& a = acc[i];
        if (n >= a.promised) { a.acceptedN = n; a.acceptedV = v; }
    }
    return v;
}

int main() {
    std::string first  = propose(1, "X", {0, 1});   // majority {0,1} accepts X
    std::string second = propose(2, "Y", {1, 2});   // quorum overlaps at 1, which holds X
    assert(first == "X");
    assert(second == "X");                            // safety: the chosen value never changes
    return 0;
}
