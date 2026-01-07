varying vec2 vUv;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform sampler2D uTexture;
void main(){
    float blocks=20.;
    vec2 blockUvs=floor(vUv*blocks)/blocks;
    vec2 mouse=uMouse;
    float dist=length(blockUvs-mouse);
    float effect=smoothstep(.2,0.,dist);
    vec2 distortion=(vUv-mouse)*effect*.3;
    vec3 color=texture2D(uTexture,vUv+(distortion*uHover)).rgb;
    gl_FragColor=vec4(color,1.);
}