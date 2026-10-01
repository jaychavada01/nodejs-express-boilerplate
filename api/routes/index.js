const { EXPRESS: express } = require("../../config/packages");
const router = express.Router();

const v1Routes = require("./v1");
const HealthRoutes = require("./HealthRoutes");

router.use("/api/v1", v1Routes);
router.use("/health", HealthRoutes);

module.exports = router;
