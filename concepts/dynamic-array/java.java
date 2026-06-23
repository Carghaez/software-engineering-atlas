// Idiomatic dynamic array in Java: the standard library's ArrayList.
import java.util.ArrayList;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> v = new ArrayList<>();

        // Amortised O(1) append — ArrayList grows its backing array (~1.5x).
        for (int i = 0; i < 10; i++) v.add(i * i);

        // O(1) indexed access and size.
        assert v.size() == 10;
        assert v.get(2) == 4;

        // Size the list up front to avoid intermediate reallocations.
        List<Integer> squares = new ArrayList<>(10);
        for (int i = 0; i < 10; i++) squares.add(i * i);
        assert squares.size() == 10 && squares.get(9) == 81;

        System.out.println("len = " + v.size() + ", third = " + v.get(2));
    }
}
