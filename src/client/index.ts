import { App } from "./Application"

const app = new App();
document.body.appendChild(app.view);

window.onresize = () => {
    app.vp.resize(window.innerWidth, window.innerHeight);
    app.renderer.resize(window.innerWidth, window.innerHeight);
};