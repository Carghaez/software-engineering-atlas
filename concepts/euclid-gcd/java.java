// Euclid's algorithm for the greatest common divisor.
class Main {
    static long gcd(long a, long b) {
        while (b != 0) { long t = a % b; a = b; b = t; }
        return Math.abs(a);
    }

    public static void main(String[] args) {
        assert gcd(48, 18) == 6;
        assert gcd(17, 5) == 1;    // coprime
        assert gcd(0, 9) == 9;     // gcd(0, n) == n
        System.out.println("ok");
    }
}
