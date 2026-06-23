// Idiomatic queue ADT in Java: ArrayDeque used as a FIFO queue.
import java.util.ArrayDeque;
import java.util.Queue;

class Main {
    public static void main(String[] args) {
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 1; i <= 3; i++) q.add(i);

        assert q.peek() == 1;          // first in, first out
        assert q.remove() == 1;
        assert q.remove() == 2;
        assert q.remove() == 3;
        assert q.isEmpty();
        System.out.println("ok");
    }
}
