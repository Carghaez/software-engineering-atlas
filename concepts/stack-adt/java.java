// Idiomatic stack ADT in Java: ArrayDeque used as a LIFO stack
// (preferred over the legacy synchronized java.util.Stack).
import java.util.ArrayDeque;
import java.util.Deque;

class Main {
    public static void main(String[] args) {
        Deque<Integer> s = new ArrayDeque<>();
        for (int i = 1; i <= 3; i++) s.push(i);

        assert s.peek() == 3;          // last in, first out
        assert s.pop() == 3;
        assert s.pop() == 2;
        assert s.pop() == 1;
        assert s.isEmpty();
        System.out.println("ok");
    }
}
