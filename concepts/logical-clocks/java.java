// Lamport logical clocks across two processes exchanging one message.
class Main {
    static class Lamport {
        int t = 0;
        int local() { return ++t; }                       // internal event / send
        int receive(int stamp) { t = Math.max(t, stamp) + 1; return t; }
    }

    public static void main(String[] a) {
        Lamport p = new Lamport(), q = new Lamport();
        p.local();                 // p: 1 (internal event)
        int msg = p.local();       // p: 2 (send) -> message carries timestamp 2
        q.local();                 // q: 1 (independent local event)
        int r = q.receive(msg);    // q: max(1, 2) + 1 = 3

        assert msg == 2 && r == 3;
        assert msg < r;            // send happens-before its receive => ordered
        System.out.println(r);
    }
}
