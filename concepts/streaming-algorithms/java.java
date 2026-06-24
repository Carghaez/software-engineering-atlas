// Streaming algorithms: a single pass in O(1) memory. Boyer-Moore majority vote over a stream.
class Main {
    static int majority(int[] stream) {
        int cand = 0, count = 0;           // one candidate, one counter — constant memory
        for (int x : stream) {
            if (count == 0) cand = x;
            count += (x == cand) ? 1 : -1;
        }
        return cand;                        // the >n/2 element, if one exists
    }

    public static void main(String[] args) {
        int[] stream = {3, 3, 4, 2, 3, 3, 5, 3, 3};   // 3 appears 6 of 9 times
        int m = majority(stream);
        int seen = 0;
        for (int x : stream) if (x == m) seen++;
        assert m == 3 && seen * 2 > stream.length;    // verified majority in one pass
        System.out.println("ok");
    }
}
