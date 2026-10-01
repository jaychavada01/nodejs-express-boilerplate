const { EXPRESS: express } = require("../../../config/packages");
const router = express.Router();
const SampleController = require("../../controllers/v1/SampleController");

/*
 * SAMPLE RESOURCE ROUTES
 * Clean route bindings - validation is handled inside controllers
 */
router.get("/list", SampleController.list);
router.get("/view", SampleController.getById);
router.post("/create", SampleController.create);
router.put("/update", SampleController.update);
router.delete("/delete", SampleController.remove);

module.exports = router;
