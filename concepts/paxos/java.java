// Single-decree Paxos: once a value is chosen, higher proposals adopt it — only one value is chosen.
class Main {
    static final int N = 3;
    static int[] promised = new int[N], acceptedN = new int[N];
    static String[] acceptedV = new String[N];

    // Run prepare(n) then accept over a majority quorum; returns the value this round commits.
    static String propose(int n, String v, int[] quorum) {
        int best = 0;                       // adopt any already-accepted value (the safety rule)
        for (int i : quorum)
            if (n > promised[i]) { promised[i] = n; if (acceptedN[i] > best) { best = acceptedN[i]; v = acceptedV[i]; } }
        for (int i : quorum)
            if (n >= promised[i]) { acceptedN[i] = n; acceptedV[i] = v; }
        return v;
    }

    public static void main(String[] args) {
        String first  = propose(1, "X", new int[]{0, 1});   // majority {0,1} accepts X
        String second = propose(2, "Y", new int[]{1, 2});   // quorum overlaps at 1, which holds X
        assert first.equals("X");
        assert second.equals("X");                           // safety: the chosen value never changes
        System.out.println("ok");
    }
}
