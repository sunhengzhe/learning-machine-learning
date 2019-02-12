import * as express from "express";

const router = express.Router();

router.get("/single-variable", (req: express.Request, res: express.Response) => {
  const pointsInStr: string = req.query.points;
  const learningRate = 0.05;

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

      // less than 10e-3
      const isStopLearning = Math.abs(theta0 - temp0) < theta0 * 0.001
          && Math.abs(theta1 - temp1) < theta1 * 0.001;

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

export default router;
