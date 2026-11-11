---
title: How quantum computers break today's cryptography
summary: What a large quantum computer would and wouldn't break in an ordinary HTTPS connection — Shor's algorithm run on a toy elliptic curve, why elliptic curves fall before RSA, Grover against AES and hashes, harvest now and decrypt later, the NIST post-quantum standards, and where things stood in November 2026.
date: 2026-11-11
tags: [qi/qc]
distillate: "A large error-corrected quantum computer would break the public-key half of today's cryptography, RSA and elliptic-curve key exchange and signatures, because Shor's algorithm turns factoring and discrete logarithms into period finding; on a 19-point toy curve it recovers the secret key from 18 of every 19 runs. Symmetric ciphers and hashes only lose to Grover's quadratic speedup, which is so slow in practice that AES-128 key search would take about 460,000 years even at a generous 1 µs per step, so they survive with their current key sizes. The danger is already real for secrets that must stay secret for years, since recorded traffic can be decrypted later, which is why NIST standardized ML-KEM, ML-DSA and SLH-DSA in 2024 and hybrid post-quantum key exchange already protected about half of human web traffic to Cloudflare by December 2025."
model: [Claude Opus 5.5]
---

Almost every secure connection on the internet rests on two kinds of cryptography. **Public-key** cryptography lets two strangers agree on a secret and lets a server prove who it is; its security rests on problems such as factoring large numbers or computing discrete logarithms. **Symmetric** cryptography, a block cipher such as AES and a hash function such as SHA-256, then protects the bulk of the data with the agreed secret. Shor (1994; journal version 1997) showed that a quantum computer could solve both factoring and discrete logarithms in polynomial time, which would break the first kind outright. Grover (1996) gave a quantum search that speeds up attacks on the second kind, but only quadratically. The difference between those two speedups decides almost everything about what has to change.

The [qubits note](note:qubits-entanglement-and-shors-algorithm) works through Shor's algorithm on factoring 15 and covers the hardware; this note takes that algorithm as known, applies it to the elliptic curves that now carry most key exchanges, and follows the consequences through one connection.

Throughout, the note follows one HTTPS connection, set up with TLS 1.3, and one toy elliptic curve small enough to simulate:

| | value |
| --- | --- |
| key exchange | X25519 (elliptic-curve Diffie–Hellman on Curve25519) |
| server's signature | ECDSA on the NIST curve P-256 |
| bulk encryption | AES-128 in GCM mode |
| hash | SHA-256 |
| toy curve | $y^2 = x^3 + 2x + 2$ over the integers mod 17 |
| toy generator and secret key | $G = (5, 1)$, of order $n = 19$; $d = 13$ |

## What breaks and what doesn't

Each part of the connection rests on a different problem, and the quantum attacks on them are of two very different strengths:

| part | rests on | best known quantum attack | effect |
| --- | --- | --- | --- |
| X25519 key exchange | elliptic-curve discrete logarithm | Shor | broken: the session key can be recovered from the recorded handshake |
| ECDSA (or RSA) signature | discrete logarithm (or factoring) | Shor | broken: the server's private key can be recovered and its signatures forged |
| AES-128 | exhaustive key search | Grover | 128-bit search becomes about $2^{64}$ sequential steps, still impractical |
| SHA-256 | preimage and collision search | Grover; Brassard–Høyer–Tapp | weakened on paper, not in practice |

Shor's speedup is exponential: the best classical attacks take time that grows exponentially (for elliptic curves) or sub-exponentially (for factoring) in the key length, and Shor's grows as a polynomial. No longer keys fix that, because doubling the key only multiplies the quantum cost by a small factor. Grover's speedup is quadratic, and doubling the key length cancels it. So the public-key algorithms have to be replaced, while the symmetric ones only need key sizes that most systems already offer.

## Elliptic-curve keys

An **elliptic curve** over a prime field is the set of points $(x, y)$ with $y^2 = x^3 + ax + b$, computed modulo a prime $p$, plus one extra *point at infinity* that acts as zero. Two points can be added by a fixed rule (draw the line through them, take the third point where it meets the curve, reflect it), and with that addition the points form a group. Adding a point $G$ to itself $d$ times gives $dG$, which is quick to compute even for a 256-bit $d$, by repeated doubling.

A private key is a number $d$, and the public key is the point $Q = dG$. Going back from $Q$ to $d$ is the **elliptic-curve discrete logarithm problem** (ECDLP). For a well-chosen curve whose group has about $2^{256}$ elements, the best classical attack, Pollard's rho method, takes about $2^{128}$ group operations, which is why a 256-bit curve is rated at 128-bit security. Elliptic-curve Diffie–Hellman (X25519 is one) has each side publish such a $Q$ and combine it with its own $d$; ECDSA signs with $d$ and verifies with $Q$. Anyone who can compute $d$ from $Q$ can read the first and forge the second.

The toy curve $y^2 = x^3 + 2x + 2$ mod 17 has 19 points including the point at infinity. Since 19 is prime, every point except zero generates the whole group, as in the curves used in practice, where the group order is a large prime (or a large prime times a small cofactor, 8 for Curve25519). With $G = (5, 1)$ and the secret $d = 13$, the public key is $Q = 13G = (16, 4)$.

## Shor's algorithm for discrete logarithms

Shor's factoring algorithm finds the period of a one-variable function. For the discrete logarithm the function has two inputs,

$$
f(a, b) = aG + bQ = (a + d\,b)\,G
$$

where $a$ and $b$ run over $0, \dots, n - 1$. The quantum computer can evaluate $f$ using only $G$ and $Q$; it never needs $d$. But $f$ depends on $a$ and $b$ only through $a + d\,b \bmod n$, so it is constant along lines in the $(a, b)$ grid, and the direction of those lines encodes $d$. The algorithm has the same steps as for factoring:

1. Put two registers, holding $a$ and $b$, into an equal superposition of all $n^2$ pairs.
2. Compute $f(a, b)$ into a third register, which entangles it with the pair.
3. Apply a quantum Fourier transform to the $a$ and $b$ registers.
4. Measure them, getting a pair $(u, v)$.

As in factoring, interference does the work. Fix a value $c$ in the third register: the pairs with $a + d\,b \equiv c$ are $(c - d\,b, \, b)$ for each $b$, and after the Fourier transform the amplitude of $(u, v)$ is proportional to

$$
\sum_{b=0}^{n-1} e^{2\pi i\,[\,u(c - d b) + v b\,]/n} = e^{2\pi i\,u c/n} \sum_{b=0}^{n-1} e^{2\pi i\,b\,(v - d u)/n}
$$

The last sum is $n$ when $v \equiv d\,u \pmod n$ and zero otherwise, since its terms then point evenly around the circle. So every outcome satisfies $v \equiv d\,u$, and whenever $u \ne 0$ the key follows as $d = v\,u^{-1} \bmod n$, with the inverse found by Euclid's algorithm. Only $u = 0$ gives nothing.

The run can be checked by simulating the state, in the same way as the factoring example in the qubits note:

```python
import numpy as np

p, A = 17, 2                      # curve y^2 = x^3 + 2x + 2 over F_17

def add(P, Q):                    # elliptic-curve point addition; None is the point at infinity
    if P is None: return Q
    if Q is None: return P
    (x1, y1), (x2, y2) = P, Q
    if x1 == x2 and (y1 + y2) % p == 0: return None
    if P == Q: s = (3 * x1 * x1 + A) * pow(2 * y1, -1, p) % p
    else:      s = (y2 - y1) * pow(x2 - x1, -1, p) % p
    x3 = (s * s - x1 - x2) % p
    return (x3, (s * (x1 - x3) - y1) % p)

G, n, d = (5, 1), 19, 13          # generator, its order, the secret key
mult = [None]                     # mult[k] = kG
for _ in range(n - 1): mult.append(add(mult[-1], G))
Q = mult[d]                       # public key, Q = dG
multQ = [None]                    # multQ[k] = kQ, built from Q alone, without d
for _ in range(n - 1): multQ.append(add(multQ[-1], Q))

# f(a, b) = aG + bQ on an n x n grid; the quantum computer makes this superposition
f = [[add(mult[a], multQ[b]) for b in range(n)] for a in range(n)]
probs = np.zeros((n, n))          # [u, v]
w = np.exp(2j * np.pi * np.outer(np.arange(n), np.arange(n)) / n)  # QFT phases, [n, n]
for value in set(sum(f, [])):     # each work-register value, measured or not
    a, b = np.array([(a, b) for a in range(n) for b in range(n) if f[a][b] == value]).T
    amp = w[:, a] @ w[:, b].T / n**2       # amplitude of (u, v), [n, n]
    probs += np.abs(amp)**2

print("public key Q =", Q)
print("outcomes with nonzero probability:", int((probs > 1e-9).sum()), "each", round(probs.max(), 4))
for u, v in np.argwhere(probs > 1e-9)[:4]:   # the first few outcomes
    print((int(u), int(v)), round(probs[u, v], 4), "-> d =", v * pow(int(u), -1, n) % n if u else "none")
print("P(u = 0) =", round(probs[0].sum(), 4))
```

```text
public key Q = (16, 4)
outcomes with nonzero probability: 19 each 0.0526
(0, 0) 0.0526 -> d = none
(1, 13) 0.0526 -> d = 13
(2, 7) 0.0526 -> d = 13
(3, 1) 0.0526 -> d = 13
P(u = 0) = 0.0526
```

Of the 361 possible pairs, only the 19 on the line $v \equiv 13\,u$ ever appear, each with probability $1/19 = 0.0526$. Every one except $(0, 0)$ gives $d = 13$, so a single run succeeds with probability $18/19 \approx 0.95$. For a 256-bit curve the same steps need registers of about 256 qubits each, plus the workspace for elliptic-curve arithmetic, which dominates the cost.

The simulation idealizes one detail. It uses a Fourier transform over exactly 19 values, while a real circuit uses registers whose size is a power of two, so the peaks spread out as in the $N = 21$ example of the qubits note and the classical post-processing has a little more to do. Proos and Zalka (2003) worked out the elliptic-curve version in detail.

## Why elliptic curves fall before RSA

A 256-bit curve and 3072-bit RSA are both rated at 128-bit classical security, and 2048-bit RSA at 112 bits, so elliptic curves look like the stronger choice. Against a quantum computer the order flips, because Shor's cost grows with the length of the numbers it handles, not with their classical security. Elliptic-curve arithmetic works on 256-bit numbers; RSA arithmetic works on 2048- or 3072-bit ones.

Proos and Zalka (2003) estimated that a 160-bit curve could be broken with about 1,000 qubits, against about 2,000 for 1024-bit RSA. Roetteler, Naehrig, Svore and Lauter (2017) gave a circuit for an $n$-bit prime-field curve with at most

$$
9n + 2\lceil \log_2 n \rceil + 10
$$

logical qubits, which for P-256 ($n = 256$) is $2304 + 16 + 10 = 2330$, and concluded that this is fewer than for attacking RSA at comparable classical security. The more recent estimates below keep that ordering: for the same assumed hardware, a 256-bit curve costs fewer qubits and far less time than RSA-2048.

## Grover against AES

Grover's algorithm searches $N$ possibilities for one that passes a test using about $(\pi/4)\sqrt{N}$ evaluations of the test, against about $N/2$ on average classically. For a cipher key the test is "does this key turn a known plaintext into the observed ciphertext", and the quantum computer has to run AES itself, reversibly and error-corrected, inside each step. Bennett, Bernstein, Brassard and Vazirani (1997) proved a matching lower bound: relative to an oracle that gives nothing away, no quantum algorithm searches $2^n$ possibilities in fewer than order $2^{n/2}$ steps. So Grover is the best possible, up to a constant, against a cipher with no exploitable structure.

For AES-128, $N = 2^{128}$, and the attack needs about $(\pi/4) \cdot 2^{64} \approx 1.45 \times 10^{19}$ Grover iterations, one after another. Two facts make that much worse than it sounds. Each iteration contains a full AES circuit, so even 1 µs per iteration, the length of a single error-correction cycle in the RSA estimates of the qubits note, is very generous. And Grover parallelizes badly: splitting the key space over $M$ machines makes each search space $M$ times smaller, so the time falls only by $\sqrt{M}$:

```python
import math

year = 3.156e7                                   # seconds
for name, bits in [("AES-128", 128), ("AES-256", 256)]:
    k = math.pi / 4 * 2 ** (bits / 2)            # Grover iterations for one key
    t = k * 1e-6 / year                          # years at 1 µs per iteration
    print(f"{name}: {k:.2e} iterations, {t:.1e} years on one machine,",
          f"{t**2:.1e} machines to finish in a year")
```

```text
AES-128: 1.45e+19 iterations, 4.6e+05 years on one machine, 2.1e+11 machines to finish in a year
AES-256: 2.67e+38 iterations, 8.5e+24 years on one machine, 7.2e+49 machines to finish in a year
```

Even at 1 µs per iteration, one machine would take about 460,000 years for one AES-128 key, and finishing within a year would take about $2 \times 10^{11}$ machines, each a large fault-tolerant quantum computer. NIST's call for proposals (2016) built this into its rules with a cap, MAXDEPTH, on how many gates an attack may run in sequence, and estimated the cost of AES-128 key search under the cap at about $2^{170}/\text{MAXDEPTH}$ quantum gates: $2^{106}$ gates if no machine may run more than $2^{64}$ in a row. Jaques, Naehrig, Roetteler and Virdia (2019) designed cheaper AES circuits for Grover under such a depth limit and lowered these estimates, without changing the picture. NIST defines the security levels of its post-quantum standards relative to this very attack: the lowest level, category 1, means at least as hard to break as finding an AES-128 key, and NIST treats that as acceptable. AES-256 squares the work again and is the usual choice where a margin is wanted.

## Hashes

For a hash function with an $n$-bit output, Grover finds a **preimage** (an input with a given hash) in about $2^{n/2}$ steps instead of $2^n$, so SHA-256 drops from 256 to 128 bits of preimage resistance, the same level as AES-128 against classical attack. **Collisions** (two inputs with the same hash) take about $2^{n/2}$ work classically, by the birthday bound. Brassard, Høyer and Tapp (1998) gave a quantum algorithm that needs only about $2^{n/3}$ evaluations, but it also needs about $2^{n/3}$ of stored, quickly accessible data. Bernstein (2009) compared full costs, counting the hardware as well as the time, and concluded that it has "fundamentally worse price-performance ratio" than the classical parallel collision search of van Oorschot and Wiener, so quantum computers "do not win for collision searches". SHA-256 is fine.

## Harvest now, decrypt later

A quantum computer that doesn't exist yet can already hurt today's data. An attacker who records an encrypted connection now, including its X25519 handshake, can store it and recover the session key whenever Shor becomes possible, then decrypt everything that was sent. This is **harvest now, decrypt later**, and it is why key exchange is being replaced first.

Mosca (2018) put the deadline as an inequality. If data must stay secret for $x$ years, and moving a system to quantum-safe cryptography takes $y$ years, then the data is already at risk when

$$
x + y > z
$$

where $z$ is the number of years until a cryptographically relevant quantum computer exists. Medical records or state secrets with $x = 25$, in a system that takes $y = 10$ years to migrate, are exposed unless such a machine is more than 35 years away.

Signatures are different. A forged signature only matters while someone still trusts it, so signatures made today can't be attacked retroactively in the same way. The exceptions are long-lived keys: root certificates, firmware signing keys, and public keys that sit in the open for years, such as those of cryptocurrency addresses that have already spent. A recovered key there can be used for as long as it is trusted.

## The replacements

In August 2024 NIST published its first three post-quantum standards, chosen after an open competition that started in 2016:

| standard | name | replaces | based on | from submission |
| --- | --- | --- | --- | --- |
| FIPS 203 | ML-KEM | key exchange (ECDH, RSA encryption) | module lattices | CRYSTALS-Kyber |
| FIPS 204 | ML-DSA | signatures | module lattices | CRYSTALS-Dilithium |
| FIPS 205 | SLH-DSA | signatures | hash functions only | SPHINCS+ |

ML-KEM and ML-DSA rest on the hardness of finding a short vector in a high-dimensional lattice, disguised by small random errors (the *learning with errors* problem in module form). No efficient quantum algorithm is known for it, and the periodic structure that Shor's method exploits in factoring and discrete logarithms hasn't been found in it. SLH-DSA assumes nothing beyond the security of its hash function, which makes it the conservative backup, at the price of large, slow signatures. In March 2025 NIST also selected HQC, a key encapsulation based on error-correcting codes, as a backup to ML-KEM that doesn't rely on lattices.

The new keys are much larger. Sizes in bytes, against what they replace:

| algorithm | role | public key | ciphertext or signature |
| --- | --- | --- | --- |
| X25519 | key exchange, today | 32 | 32 (the other side's public key) |
| ML-KEM-768 | key exchange | 1,184 | 1,088 |
| ECDSA P-256 | signature, today | 65 (uncompressed point) | 64 |
| ML-DSA-65 | signature | 1,952 | 3,309 |
| SLH-DSA-SHA2-128s | signature | 32 | 7,856 |
| SLH-DSA-SHA2-128f | signature | 32 | 17,088 |

The post-quantum sizes were measured by running open-source Python implementations of the three standards, and the ML-DSA figures match Table 2 of FIPS 204; the X25519 size is from RFC 7748. ML-KEM-768 and ML-DSA-65 sit at NIST's category 3, comparable to AES-192, and NIST recommends ML-KEM-768 as the default (NIST IR 8547). The SLH-DSA sets are category 1: the "s" set has smaller signatures, the "f" set signs faster.

A key exchange adds about 2.3 kB to a handshake, which networks handle without much trouble. Signatures are harder, because a certificate chain carries several of them, each now kilobytes instead of 64 bytes. Together with harvest now, decrypt later, that is why key exchange is being moved first.

**Hybrids guard against the new algorithms being wrong.** The post-quantum schemes are young, and one of them already failed. SIKE, an isogeny-based key exchange that reached the fourth round of the NIST process, was broken by Castryck and Decru (2023) with a classical attack that recovered a key at its lowest security level "in about ten minutes on a single core". So the key exchange now deployed, X25519MLKEM768, runs X25519 and ML-KEM-768 side by side and derives the session key from both secrets. An attacker has to break both: the connection stays safe against a quantum computer if ML-KEM holds, and against a classical break of ML-KEM if X25519 holds.

## Where things stand

*This section is a snapshot as of November 2026 and is not kept up to date. Each claim is from the source cited, checked on 2026-11-11.*

**No quantum computer can attack real keys yet.** The largest error-corrected demonstrations are around a hundred physical qubits per logical qubit and a few dozen logical qubits in total, and no experiment has run Shor's algorithm on a number or curve that is hard classically; the [qubits note](note:qubits-entanglement-and-shors-algorithm) has the details and the falling estimates for RSA-2048, which reach under a million physical qubits and under a week (Gidney, 2025).

**The estimated cost of breaking a 256-bit curve has fallen faster.** These are design studies with assumed hardware, not machines:

| source | qubits | time | main assumption |
| --- | --- | --- | --- |
| Roetteler et al. (2017) | 2,330 logical | not estimated; $1.3 \times 10^{11}$ Toffoli gates | circuit only, any $n$-bit prime-field curve |
| Litinski (2023, preprint) | about 6.9 million physical | one key every 10 minutes | 10 µs code cycle, non-local connections |
| Babbush et al. (2026, preprint) | under 1,200 logical; under half a million physical | minutes | superconducting, $10^{-3}$ error, planar connectivity |
| IonQ (2026, company report) | 19,397 physical; 1,457 logical | 25.7 days per attempt | trapped ions, quantum LDPC codes, 29.5 ms cycle |

The Toffoli count for Roetteler et al. is their bound $448\,n^3 \log_2 n + 4090\,n^3$ evaluated at $n = 256$, and Litinski's qubit count is his 6,000 modules of 1,152 physical qubits each. Babbush et al., whose authors include Gidney, assume about the same hardware as Gidney's RSA estimate, and on it a 256-bit curve takes under half the qubits and minutes instead of days, the ordering of the section on why elliptic curves fall first. They also give two circuit versions, with under 1,200 logical qubits and 90 million Toffoli gates, or under 1,450 and 70 million. IonQ's attempt succeeds with probability at least 40.7%, so a key takes a few attempts on average.

**The deadline in NIST's rules is set.** The final NIST IR 8547, published on 27 October 2026, says NIST will deprecate quantum-vulnerable public-key cryptography, including RSA, ECDSA, EdDSA and elliptic-curve Diffie–Hellman, after 2030, and disallow it under its standards after 2035. Two more standards are being written: FN-DSA, a signature scheme derived from Falcon with smaller signatures than ML-DSA, and one for HQC.

**Hybrid key exchange is already common.** Chrome moved its hybrid post-quantum key exchange from the pre-standard Kyber to ML-KEM in version 131, released in November 2024. OpenSSH 10.0 (April 2025) made `mlkem768x25519-sha256` its default key agreement. Cloudflare reported that 52% of human web traffic reaching it was post-quantum encrypted by December 2025. The IETF specification of X25519MLKEM768 for TLS 1.3 was in the RFC Editor's queue, not yet published as an RFC. Post-quantum signatures in the web's certificates had not been deployed at scale.

## Sources

- P. W. Shor, "Polynomial-time algorithms for prime factorization and discrete logarithms on a quantum computer", *SIAM J. Comput.* 26, 1484 (1997). [arXiv:quant-ph/9508027](https://arxiv.org/abs/quant-ph/9508027)
- L. K. Grover, "A fast quantum mechanical algorithm for database search" (1996). [arXiv:quant-ph/9605043](https://arxiv.org/abs/quant-ph/9605043)
- J. Proos, C. Zalka, "Shor's discrete logarithm quantum algorithm for elliptic curves" (2003). [arXiv:quant-ph/0301141](https://arxiv.org/abs/quant-ph/0301141)
- M. Roetteler, M. Naehrig, K. M. Svore, K. Lauter, "Quantum resource estimates for computing elliptic curve discrete logarithms" (2017). [arXiv:1706.06752](https://arxiv.org/abs/1706.06752)
- C. H. Bennett, E. Bernstein, G. Brassard, U. Vazirani, "Strengths and weaknesses of quantum computing", *SIAM J. Comput.* 26, 1510–1523 (1997). [doi:10.1137/S0097539796300933](https://doi.org/10.1137/S0097539796300933), [arXiv:quant-ph/9701001](https://arxiv.org/abs/quant-ph/9701001)
- NIST, "Submission requirements and evaluation criteria: security" (call for proposals, 2016). [csrc.nist.gov](https://csrc.nist.gov/projects/post-quantum-cryptography/post-quantum-cryptography-standardization/evaluation-criteria/security-(evaluation-criteria))
- S. Jaques, M. Naehrig, M. Roetteler, F. Virdia, "Implementing Grover oracles for quantum key search on AES and LowMC" (2019). [arXiv:1910.01700](https://arxiv.org/abs/1910.01700)
- G. Brassard, P. Høyer, A. Tapp, "Quantum algorithm for the collision problem" (1997). [doi:10.1007/BFb0054319](https://doi.org/10.1007/BFb0054319), [arXiv:quant-ph/9705002](https://arxiv.org/abs/quant-ph/9705002)
- D. J. Bernstein, "Cost analysis of hash collisions: will quantum computers make SHARCS obsolete?" (2009). [cr.yp.to](https://cr.yp.to/hash/collisioncost-20090823.pdf)
- M. Mosca, "Cybersecurity in an era with quantum computers: will we be ready?", *IEEE Security & Privacy* 16(5), 38–41 (2018). [doi:10.1109/MSP.2018.3761723](https://doi.org/10.1109/MSP.2018.3761723)
- NIST, FIPS 203, "Module-Lattice-Based Key-Encapsulation Mechanism Standard" (2024). [csrc.nist.gov](https://csrc.nist.gov/pubs/fips/203/final)
- NIST, FIPS 204, "Module-Lattice-Based Digital Signature Standard" (2024). [csrc.nist.gov](https://csrc.nist.gov/pubs/fips/204/final)
- NIST, FIPS 205, "Stateless Hash-Based Digital Signature Standard" (2024). [csrc.nist.gov](https://csrc.nist.gov/pubs/fips/205/final)
- NIST, "NIST selects HQC as fifth algorithm for post-quantum encryption", 11 March 2025. [nist.gov](https://www.nist.gov/news-events/news/2025/03/nist-selects-hqc-fifth-algorithm-post-quantum-encryption)
- W. Castryck, T. Decru, "An efficient key recovery attack on SIDH", Eurocrypt 2023. [eprint.iacr.org/2022/975](https://eprint.iacr.org/2022/975)
- IETF, RFC 7748, "Elliptic Curves for Security" (January 2016). [rfc-editor.org](https://www.rfc-editor.org/rfc/rfc7748)
- C. Gidney, "How to factor 2048 bit RSA integers with less than a million noisy qubits" (preprint, 2025). [arXiv:2505.15917](https://arxiv.org/abs/2505.15917)
- D. Litinski, "How to compute a 256-bit elliptic curve private key with only 50 million Toffoli gates" (preprint, 2023). [arXiv:2306.08585](https://arxiv.org/abs/2306.08585)
- R. Babbush et al., "Securing elliptic curve cryptocurrencies against quantum vulnerabilities: resource estimates and mitigations" (preprint, 2026). [arXiv:2603.28846](https://arxiv.org/abs/2603.28846)
- IonQ, "IonQ's fully compiled, end-to-end resource estimate for breaking 256-bit elliptic-curve signatures" (company report, 8 September 2026). [ionq.com](https://www.ionq.com/resources/ionqs-fully-compiled-end-to-end-resource-estimate-for-breaking-256-bit-elliptic-curve-signatures)
- NIST, IR 8547, "Transition to Post-Quantum Cryptography Standards" (final, October 2026). [csrc.nist.gov](https://csrc.nist.gov/pubs/ir/8547/final)
- Google Security Blog, "A new path for Kyber on the web", 13 September 2024. [security.googleblog.com](https://security.googleblog.com/2024/09/a-new-path-for-kyber-on-web.html)
- Chrome 131 release notes, 12 November 2024. [developer.chrome.com](https://developer.chrome.com/release-notes/131)
- OpenSSH 10.0 release notes, 9 April 2025. [openssh.org](https://www.openssh.org/txt/release-10.0)
- Cloudflare, "Cloudflare Radar 2025 Year in Review", 15 December 2025. [blog.cloudflare.com](https://blog.cloudflare.com/radar-2025-year-in-review/)
- IETF, "Post-quantum hybrid ECDHE-MLKEM key agreement for TLSv1.3", draft-ietf-tls-ecdhe-mlkem-04. [datatracker.ietf.org](https://datatracker.ietf.org/doc/draft-ietf-tls-ecdhe-mlkem/)
