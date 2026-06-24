// Raft leader election: vote-once-per-term makes quorums intersect, so a term has one leader.
import java.util.Arrays;

class Main {
    static final int N = 5;
    static int[] votedFor = new int[N];    // per current term; -1 = not yet voted

    static int requestVotes(int candidate, int[] peers) {
        int votes = 1;                      // a candidate votes for itself
        for (int p : peers)
            if (votedFor[p] == -1) { votedFor[p] = candidate; votes++; }
        return votes;
    }

    public static void main(String[] args) {
        Arrays.fill(votedFor, -1);
        int a = requestVotes(0, new int[]{1, 2});   // node 0 courts {1,2}
        int b = requestVotes(3, new int[]{2, 4});   // node 3 courts {2,4}; node 2 voted for 0
        assert a == 3 && a >= N / 2 + 1;    // majority -> 0 is leader for the term
        assert b == 2 && b <  N / 2 + 1;    // 3 falls short: quorums overlapped at node 2
        System.out.println("ok");
    }
}
