module.exports = app => {
    const router = require("express").Router();
    const availabilityController = require("../controller/availability.controller")
    router.route("/").post(availabilityController.create)
    router.route("/").get(availabilityController.getAll)
    app.use("/api/availability",  router);
};