import { App } from "./Application"

const app = new App();
document.body.appendChild(app.view);

window.onresize = () => {
    app.vp.resize(window.innerWidth * 0.9, window.innerHeight * 0.9);
    app.renderer.resize(window.innerWidth * 0.9, window.innerHeight * 0.9);
};

