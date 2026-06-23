// Idiomatic double-ended queue in Java: ArrayDeque.
import java.util.ArrayDeque;
import java.util.Deque;

class Main {
    public static void main(String[] args) {
        Deque<Integer> d = new ArrayDeque<>();
        d.addLast(1); d.addFirst(2); d.addLast(3);     // -> [2, 1, 3]
        assert d.peekFirst() == 2 && d.peekLast() == 3;
        assert d.size() == 3;
        d.pollFirst(); assert d.peekFirst() == 1;
        d.pollLast();  assert d.peekLast() == 1;
        System.out.println("ok");
    }
}
