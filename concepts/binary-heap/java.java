// Idiomatic binary heap in Java: PriorityQueue (a min-heap by default).
import java.util.PriorityQueue;

class Main {
    public static void main(String[] args) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int x : new int[]{3, 1, 4, 1, 5, 9, 2, 6}) pq.add(x);

        assert pq.peek() == 1;             // smallest at the head

        int prev = Integer.MIN_VALUE;
        while (!pq.isEmpty()) {
            int top = pq.poll();
            assert top >= prev;            // polls in ascending order
            prev = top;
        }
        assert prev == 9;
        System.out.println("ok");
    }
}
