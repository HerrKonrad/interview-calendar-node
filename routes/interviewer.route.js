module.exports = app => {
    const interviewerController = require("../controller/interviewer.controller")
    const router = require("express").Router();

    router.route("/").post(interviewerController.create)
    router.route("/:idinterviewer").get(interviewerController.getById)
    router.route("/").get(interviewerController.getAll)
    router.route("/:idinterviewer").put(interviewerController.update)
    router.route("/:idinterviewer").delete(interviewerController.delete)
    app.use("/api/interviewer",  router);
};