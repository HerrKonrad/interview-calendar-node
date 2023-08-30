module.exports = app => {
    const candidateController = require("../controller/candidate.controller")
    const router = require("express").Router();

    router.route("/").post(candidateController.create)
    router.route("/:idcandidate").get(candidateController.getById)
    router.route("/").get(candidateController.getAll)
    router.route("/:idcandidate").put(candidateController.update)
    router.route("/:idcandidate").delete(candidateController.delete)
    app.use("/api/candidate",  router);
};