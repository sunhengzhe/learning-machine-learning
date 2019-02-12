import * as express from "express";

const router = express.Router();

const hypothesis = (coords: number[], thetas: number[]): number => {
    let total = 0;
    thetas.forEach((theta, i) => {
        total += i === 0 ? theta * 1 : theta * coords[i - 1];
    });
    return total;
};

const calculateTheta = (learningRate: number, points: number[][], thetas: number[]): number[] => {
    const resultThetas: number[] = [];
    const thetaNum = thetas.length;

    for (let i = 0; i < thetaNum; i++) {
        let total = 0;
        points.forEach((coords) => {
            const diff = hypothesis(coords, thetas) - coords[coords.length - 1];
            total += diff * (i === 0 ? 1 : coords[i - 1]);
        });

        const temp = thetas[i] - learningRate / points.length * total;
        resultThetas.push(temp);
    }

    return resultThetas;
};

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

  let theta0 = 0;
  let theta1 = 0;

  const startTime = Date.now();
  const interval = setInterval(() => {
      const [temp0, temp1] = calculateTheta(learningRate, points, [theta0, theta1]);

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
