import * as express from "express";

export const register = ( app: express.Application ) => {
    // define a route handler for the default home page
    app.get( "/", ( req: any, res ) => {
        res.render( "index" );
    });

    app.get("/api/linear-regression", (req: express.Request, res: express.Response) => {
        const pointsInStr: string = req.query.points;
        const learningRate = 0.05;
        const accuracy = 9;

        let points: Array<[number, number]> = [];

        try {
            points = JSON.parse(pointsInStr);
        } catch (e) {
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

        const hypothesis = (t0: number, t1: number, x: number): number => t0 + t1 * x;

        const sumInTheta0 = (t0: number, t1: number): number => {
            let total = 0;
            points.forEach(([x, y]) => {
                total += hypothesis(t0, t1, x) - y;
            });
            return total;
        };

        const sumInTheta1 = (t0: number, t1: number): number => {
            let total = 0;
            points.forEach(([x, y]) => {
                total += (hypothesis(t0, t1, x) - y) * x;
            });
            return total;
        };

        let theta0 = 0;
        let theta1 = 0;

        const startTime = Date.now();
        const interval = setInterval(() => {
            const temp0 = theta0 - learningRate / points.length * sumInTheta0(theta0, theta1);
            const temp1 = theta1 - learningRate / points.length * sumInTheta1(theta0, theta1);

            // tslint:disable-next-line:no-console
            console.log(temp0, temp1);

            const isStopLearning = temp0.toFixed(accuracy) === theta0.toFixed(accuracy)
                && temp1.toFixed(accuracy) === theta1.toFixed(accuracy);

            if (isStopLearning || Date.now() - startTime > 10000) {
                clearInterval(interval);
                res.send({
                    theta0: theta0.toFixed(2),
                    theta1: theta1.toFixed(2)
                });
            }

            theta0 = temp0;
            theta1 = temp1;
        });
    });
};
