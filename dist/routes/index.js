"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = (app) => {
    // define a route handler for the default home page
    app.get("/", (req, res) => {
        res.render("index");
    });
    app.get("/api/linear-regression", (req, res) => {
        const pointsInStr = req.query.points;
        const learningRate = 0.01;
        const accuracy = 9;
        let points = [];
        try {
            points = JSON.parse(pointsInStr).map(([x, y]) => {
                return [x, y];
            });
        }
        catch (e) {
            res.status(400).send("invalid points");
            return;
        }
        if (!Array.isArray(points) || points.some((item) => !Array.isArray(item) || item.length > 2)) {
            res.status(400).send("invalid points");
            return;
        }
        if (points.length > 100) {
            res.status(400).send("too many points");
            return;
        }
        const hypothesis = (t0, t1, x) => t0 + t1 * x;
        const sumInTheta0 = (t0, t1) => {
            let total = 0;
            points.forEach(([x, y]) => {
                total += hypothesis(t0, t1, x) - y;
            });
            return total;
        };
        const sumInTheta1 = (t0, t1) => {
            let total = 0;
            points.forEach(([x, y]) => {
                total += (hypothesis(t0, t1, x) - y) * x;
            });
            return total;
        };
        let theta0 = 0;
        let theta1 = 0;
        const startTime = Date.now();
        while (true) {
            const temp0 = theta0 - learningRate / points.length * sumInTheta0(theta0, theta1);
            const temp1 = theta1 - learningRate / points.length * sumInTheta1(theta0, theta1);
            // tslint:disable-next-line:no-console
            console.log(temp0, temp1);
            const isStopLearning = temp0.toFixed(accuracy) === theta0.toFixed(accuracy)
                && temp1.toFixed(accuracy) === theta1.toFixed(accuracy);
            if (isStopLearning || Date.now() - startTime > 10000) {
                break;
            }
            theta0 = temp0;
            theta1 = temp1;
        }
        res.send({
            theta0: theta0.toFixed(2),
            theta1: theta1.toFixed(2)
        });
    });
};
//# sourceMappingURL=index.js.map