# Patches p5.brush's blend shader for CPU (SwiftShader) rendering on a transparent canvas:
#  1. opaque marks skip the 38-band spectral mix (exact: the result is the pigment itself)
#  2. partial marks use a 3-channel Kubelka-Munk mix (same idea as the spectral one, ~15x cheaper)
#  3. over transparent pixels the mark keeps an alpha chosen so that laid over paper it matches the K-M mix over paper
import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src).read()
i = s.find('const float GAMMA=2.4'); assert i > 0
km = ("float ksf(float R){R=clamp(R,0.0001,1.0);return (1.0-R)*(1.0-R)/(2.0*R);}"
      "float kmf(float k){return 1.0+k-sqrt(k*k+2.0*k);}"
      "vec3 km3(vec3 c1,vec3 c2,float f){vec3 l1=max(spectral_srgb_to_linear(c1),vec3(0.0001));vec3 l2=max(spectral_srgb_to_linear(c2),vec3(0.0001));"
      "float y1=dot(l1,vec3(.2126,.7152,.0722)),y2=dot(l2,vec3(.2126,.7152,.0722));float a=(1.0-f)*(1.0-f)*y1,b=f*f*y2,t=a+b;"
      "vec3 R=vec3(kmf((ksf(l1.r)*a+ksf(l2.r)*b)/t),kmf((ksf(l1.g)*a+ksf(l2.g)*b)/t),kmf((ksf(l1.b)*a+ksf(l2.b)*b)/t));return spectral_linear_to_srgb(R);}")
s = s[:i] + km + s[i:]
old = 'vec3 bgColor=mix(vec3(1.0),source.rgb,source.a);outColor=vec4(spectral_mix(bgColor,pigment.rgb,mixIntensity),1.);}'
assert s.count(old) == 1
new = ('float sa=source.a;vec3 P0=vec3(0.953,0.922,0.863);vec3 srcC=sa>0.002?source.rgb/sa:P0;bool full=mixIntensity>=0.999;'
       'vec3 mixed=full?pigment.rgb:km3(srcC,pigment.rgb,mixIntensity);'
       'float a2=1.0;if(!full&&sa<0.998){vec3 Cm=km3(P0,pigment.rgb,mixIntensity);vec3 d=P0-pigment.rgb;a2=clamp(dot(P0-Cm,d)/max(dot(d,d),0.0001),0.0,1.0);}'
       'outColor=vec4(mixed*sa+pigment.rgb*a2*(1.0-sa),sa+a2*(1.0-sa));}')
s = s.replace(old, new)
open(dst, 'w').write(s)
print('patched', dst)
