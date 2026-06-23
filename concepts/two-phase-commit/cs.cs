// Two-phase commit: coordinator commits iff every participant votes to prepare.
bool Coordinate(List<Participant> ps)
{
    bool all = true;
    foreach (var p in ps) all &= p.Prepare();                     // phase 1: vote
    foreach (var p in ps) { if (all) p.Commit(); else p.Abort(); } // phase 2: decide
    return all;
}

var yes = new List<Participant> { new(true), new(true) };
Check(Coordinate(yes) && yes[0].Committed && yes[1].Committed, "unanimous -> commit");

var mixed = new List<Participant> { new(true), new(false) };
Check(!Coordinate(mixed) && mixed[0].Aborted && mixed[1].Aborted, "one NO -> abort all");

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}

class Participant
{
    readonly bool vote;
    public bool Committed, Aborted;
    public Participant(bool v) { vote = v; }
    public bool Prepare() => vote;
    public void Commit() => Committed = true;
    public void Abort() => Aborted = true;
}
