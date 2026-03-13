import "./style.scss";
import "@fontsource/righteous/index.css";
import "@fontsource/ubuntu-mono/index.css";
import { type ISourceOptions, tsParticles } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const particlesConfig: ISourceOptions = {
  fpsLimit: 60,
  particles: {
    number: {
      value: 70,
      density: {
        enable: true,
        width: 800,
        height: 800,
      },
    },
    color: {
      value: "#000000",
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: { min: 0.1, max: 0.5 },
    },
    size: {
      value: { min: 0.1, max: 6 },
    },
    links: {
      enable: true,
      distance: 150,
      color: "#000000",
      opacity: 0.4,
      width: 3,
    },
    move: {
      enable: true,
      speed: 1.0,
      direction: "none",
      random: false,
      straight: false,
      outModes: "out",
    },
  },
  interactivity: {
    detectsOn: "canvas",
    events: {
      onHover: {
        enable: true,
        mode: "grab",
      },
      onClick: {
        enable: false,
        mode: "push",
      },
    },
    modes: {
      grab: {
        distance: 194.89853095232286,
        links: {
          opacity: 1,
        },
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
      push: {
        quantity: 4,
      },
      remove: {
        quantity: 2,
      },
    },
  },
  detectRetina: true,
};

loadSlim(tsParticles).then(() => {
  tsParticles.load({ id: "particles-js", options: particlesConfig });
});
