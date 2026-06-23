// Fixed-capacity ring (circular) buffer with wraparound indices.
class Main {
    static final int CAP = 4;
    static int[] buf = new int[CAP];
    static int head = 0, count = 0;

    static void push(int v) { assert count < CAP; buf[(head + count) % CAP] = v; count++; }
    static int pop() { assert count > 0; int v = buf[head]; head = (head + 1) % CAP; count--; return v; }

    public static void main(String[] args) {
        push(1); push(2); push(3);
        assert pop() == 1;
        push(4); push(5);           // indices wrap around
        assert count == CAP;
        assert pop() == 2 && pop() == 3 && pop() == 4 && pop() == 5;
        assert count == 0;
        System.out.println("ok");
    }
}
