 <template>
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width="258.000000pt"
    height="204.000000pt"
    viewBox="0 0 258.000000 204.000000"
    preserveAspectRatio="xMidYMid meet"
    @click="$route.name != 'home' ? $router.push({name:'home'}) : ''"
  >
    <g
      transform="translate(0.000000,204.000000) scale(0.100000,-0.100000)"
      :fill="fill"
      stroke="none"
    >
      <path
        d="M415 1749 c-186 -27 -291 -104 -335 -248 -18 -58 -20 -94 -20 -460 0
-308 3 -408 14 -449 35 -130 114 -205 261 -247 49 -15 117 -19 373 -22 173 -3
329 -2 348 1 47 9 57 48 52 213 -2 111 -6 135 -21 150 -16 16 -45 19 -273 23
l-256 5 -24 28 -24 28 0 270 0 271 29 29 29 29 245 0 c312 0 291 -13 295 172
4 150 -6 202 -41 212 -33 9 -583 5 -652 -5z"
      />
      <path
        d="M1360 1740 c-20 -20 -20 -33 -20 -700 0 -667 0 -680 20 -700 20 -20
33 -20 558 -20 449 0 541 2 558 14 18 14 19 31 22 361 2 301 1 351 -13 371
-15 24 -16 24 -205 24 -177 0 -190 -1 -200 -19 -6 -12 -10 -93 -10 -195 l0
-176 -140 0 -140 0 0 510 c0 497 -1 511 -20 530 -19 19 -33 20 -205 20 -172 0
-186 -1 -205 -20z"
      />
    </g>
  </svg>
</template>
<script>
export default {
  name: "cl-logo",
  props: {
    fill: String
  }
};
</script>