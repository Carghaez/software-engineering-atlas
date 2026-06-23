// Two-phase commit: coordinator commits iff every participant votes to prepare.
import java.util.List;

class Main {
    static class Participant {
        final boolean vote;
        boolean committed, aborted;
        Participant(boolean v) { vote = v; }
        boolean prepare() { return vote; }
        void commit() { committed = true; }
        void abort() { aborted = true; }
    }

    static boolean coordinate(List<Participant> ps) {
        boolean all = true;
        for (Participant p : ps) all &= p.prepare();                        // phase 1: vote
        for (Participant p : ps) { if (all) p.commit(); else p.abort(); }   // phase 2: decide
        return all;
    }

    public static void main(String[] a) {
        var yes = List.of(new Participant(true), new Participant(true));
        assert coordinate(yes);
        assert yes.get(0).committed && yes.get(1).committed;

        var mixed = List.of(new Participant(true), new Participant(false));
        assert !coordinate(mixed);
        assert mixed.get(0).aborted && mixed.get(1).aborted;
        System.out.println("ok");
    }
}
