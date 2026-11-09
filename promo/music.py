import numpy as np, wave, sys
SR=44100; DUR=24.0; N=int(SR*DUR)
L=np.zeros(N); Rr=np.zeros(N)
rng=np.random.default_rng(3)
def mtof(m): return 440*2**((m-69)/12)
def add(sig, t, pan=0.0, gain=1.0):
    i=int(t*SR); 
    if i>=N: return
    s=sig[:N-i]*gain
    L[i:i+len(s)]+=s*np.sqrt((1-pan)/2)*1.414; Rr[i:i+len(s)]+=s*np.sqrt((1+pan)/2)*1.414
def env(n, a, d, sus=0.0, r=None):
    t=np.arange(n)/SR
    e=np.minimum(1, t/max(a,1e-4))*np.exp(-t/d) if r is None else np.minimum(1,t/a)
    return e
def lp(x, a):  # one-pole lowpass
    y=np.empty_like(x); acc=0.0
    for i in range(len(x)): acc+= a*(x[i]-acc); y[i]=acc
    return y
def pad(freqs, dur):
    n=int(dur*SR); t=np.arange(n)/SR; s=np.zeros(n)
    for f in freqs:
        for det in (-0.12, 0.0, 0.12):
            ff=f*2**(det/12)
            s+= np.sin(2*np.pi*ff*t) + 0.35*np.sin(2*np.pi*2*ff*t) + 0.15*np.sin(2*np.pi*3*ff*t)
    e=np.minimum(1,t/0.35)*np.minimum(1,(dur-t)/0.4)
    return s*e/ (len(freqs)*3)
def pluck(f, dur=0.5, bright=1.0):
    n=int(dur*SR); t=np.arange(n)/SR
    s=np.sin(2*np.pi*f*t)+0.5*bright*np.sin(2*np.pi*2*f*t)*np.exp(-t*8)+0.25*bright*np.sin(2*np.pi*3*f*t)*np.exp(-t*12)
    return s*np.exp(-t*6)*np.minimum(1,t/0.004)
def kick():
    n=int(0.35*SR); t=np.arange(n)/SR
    f=45+110*np.exp(-t*30); ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-t*9)
def clap():
    n=int(0.25*SR); t=np.arange(n)/SR; nz=rng.standard_normal(n)
    nz=nz-lp(nz,0.25)  # highpass-ish
    e=np.exp(-t*25)+0.6*np.exp(-np.maximum(0,t-0.012)*25)*(t>0.012)
    return nz*e*0.6
def hat():
    n=int(0.06*SR); t=np.arange(n)/SR; nz=rng.standard_normal(n); nz=nz-lp(nz,0.6)
    return nz*np.exp(-t*70)*0.35
def bell(f, dur=1.6):
    n=int(dur*SR); t=np.arange(n)/SR; s=np.zeros(n)
    for r,a,d in ((1,1,2.2),(2.0,.5,1.4),(2.76,.35,1.0),(5.4,.2,.5)):
        s+=a*np.sin(2*np.pi*f*r*t)*np.exp(-t*d*1.6)
    return s*np.minimum(1,t/0.002)*0.5
def tick():
    n=int(0.03*SR); t=np.arange(n)/SR
    return (np.sin(2*np.pi*2400*t)+0.5*rng.standard_normal(n))*np.exp(-t*220)*0.35
def whoosh(dur=0.7, up=True):
    n=int(dur*SR); t=np.arange(n)/SR; nz=rng.standard_normal(n)
    out=np.empty(n); acc=0.0
    for i in range(n):
        x=i/n; a=(0.02+0.25*(x if up else 1-x))
        acc+=a*(nz[i]-acc); out[i]=acc
    e=np.sin(np.pi*t/dur)**2
    return out*e*1.2
def boom():
    n=int(1.4*SR); t=np.arange(n)/SR
    f=38+70*np.exp(-t*12); ph=2*np.pi*np.cumsum(f)/SR
    nz=lp(rng.standard_normal(n),0.08)*np.exp(-t*6)
    return (np.sin(ph)*np.exp(-t*2.8)+nz*0.8)
def pop(f):
    n=int(0.12*SR); t=np.arange(n)/SR
    fr=f*(1+1.5*np.exp(-t*60)); ph=2*np.pi*np.cumsum(fr)/SR
    return np.sin(ph)*np.exp(-t*35)*0.6

BEAT=0.5; T0=4.3
# Am F C G  (MIDI)
CH=[(57,60,64),(53,57,60),(48,52,55),(55,59,62)]
ROOT=[45,41,36,43]
ARP=[[69,72,76,72],[65,69,72,69],[64,67,72,67],[62,67,71,67]]

# intro (chat) — pad suave + pops
add(pad([mtof(m) for m in CH[0]],2.3),0.0,gain=0.28)
add(pad([mtof(m) for m in CH[1]],2.3),2.0,gain=0.28)
for i,(tt,f) in enumerate(zip([.3,.85,1.4,1.9,2.45,2.95],[880,660,880,660,880,520])):
    add(pop(f),tt,pan=(-.4 if i%2==0 else .4),gain=1.1)
# intro arpejo leve
for k in range(8):
    tt=k*0.5; ch=ARP[0 if tt<2 else 1]
    add(pluck(mtof(ch[k%4]),0.4,0.5),tt,pan=0.3*np.sin(k),gain=0.17)
add(whoosh(0.55,False),3.75,gain=0.35)
# impactos
add(boom(),T0,gain=0.9); add(boom(),4.65,gain=0.7)
add(bell(mtof(81),1.2),4.65,gain=0.18)

END=23.2
# groove
nb=int((END-T0)/BEAT)
for b in range(nb):
    t=T0+b*BEAT; bar=int(b//4)%4
    if t<END-0.1:
        if b>=2: add(kick(),t,gain=0.75)
        if b%2==1 and t>=7.0: add(clap(),t,pan=0.1,gain=0.45)
        if t>=7.0: add(hat(),t+BEAT/2,pan=0.35,gain=0.5)
        if t>=11.6: add(hat(),t+BEAT/4,pan=-.35,gain=0.25); add(hat(),t+3*BEAT/4,pan=-.35,gain=0.25)
    # baixo
    if b>=2:
        for e in (0,0.5):
            add(pluck(mtof(ROOT[bar]),0.28,0.6),t+e*BEAT,gain=0.32)
    # arpejo
    if t>=5.3:
        for s in range(2):
            add(pluck(mtof(ARP[bar][(b*2+s)%4]+12*(t>=11.6)),0.35,1.0),t+s*BEAT/2,pan=0.4*np.sin(b+s),gain=0.09)
    if b%4==0:
        add(pad([mtof(m) for m in CH[bar]]+[mtof(CH[bar][0]+12)],2.15),t,gain=0.13)

# sorteio: ticks
for r,stop in enumerate([13.3,14.0,14.7]):
    t=12.2
    while t<stop-0.05:
        p=(t-12.2)/(stop-12.2)
        add(tick(),t,pan=[-.5,0,.5][r],gain=0.5)
        t+=0.045+0.25*p**2.2
for stop,m in zip([13.3,14.0,14.7],[76,79,84]):
    add(bell(mtof(m)),stop,gain=0.35)
add(whoosh(0.9,True),13.85,gain=0.25)
# confete: brilho
for k,m in enumerate([84,88,91,96,91,96,100]):
    add(bell(mtof(m),1.0),14.75+k*0.06,pan=np.sin(k)*0.6,gain=0.12)
add(boom(),14.75,gain=0.5)
add(whoosh(0.6,True),11.45,gain=0.3)
add(whoosh(0.7,True),15.75,gain=0.35)
add(whoosh(0.7,True),19.65,gain=0.35)
# final
add(boom(),19.9,gain=0.6)
add(pad([mtof(m) for m in (45,57,60,64,69)],4.2),END-2.0+0.0,gain=0.14)
add(bell(mtof(81),2.5),END-0.2,gain=0.2); add(bell(mtof(76),2.5),END-0.2,gain=0.15)

st=np.stack([L,Rr],1)
# fade out final + normalização/soft clip
t=np.arange(N)/SR
st*=np.clip((DUR-t)/0.9,0,1)[:,None]
st/=np.max(np.abs(st))*1.05
st=np.tanh(st*1.4)/np.tanh(1.4)
st*=0.89
with wave.open(sys.argv[1],'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st*32767).astype('<i2').tobytes())
print('ok')
