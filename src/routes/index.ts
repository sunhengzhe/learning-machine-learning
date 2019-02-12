import * as express from "express";
import linearRegressionRouter from "./linear-regression";

export const register = ( app: express.Application ) => {
    // define a route handler for the default home page
    app.get( "/", ( req: any, res ) => {
        res.render( "index" );
    });

    app.use("/api/linear-regression", linearRegressionRouter);
};
