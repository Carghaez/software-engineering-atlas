// Euclid's algorithm for the greatest common divisor.
static long Gcd(long a, long b)
{
    while (b != 0) (a, b) = (b, a % b);
    return Math.Abs(a);
}

Check(Gcd(48, 18) == 6, "48,18");
Check(Gcd(17, 5) == 1, "coprime");
Check(Gcd(0, 9) == 9, "gcd(0,n)=n");

static void Check(bool ok, string msg)
{
    if (!ok) throw new Exception($"assertion failed: {msg}");
}
