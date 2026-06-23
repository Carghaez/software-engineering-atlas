// Idiomatic binary search in Java: Arrays.binarySearch over a sorted array.
import java.util.Arrays;

class Main {
    public static void main(String[] args) {
        int[] a = {1, 3, 4, 7, 9, 11, 15};

        assert Arrays.binarySearch(a, 7) == 3;
        assert Arrays.binarySearch(a, 1) == 0;
        assert Arrays.binarySearch(a, 15) == 6;

        // A miss returns -(insertion point) - 1.
        int miss = Arrays.binarySearch(a, 8);
        assert miss < 0 && -(miss + 1) == 4;
        System.out.println("ok");
    }
}
