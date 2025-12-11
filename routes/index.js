import express from "express";
import about__chiefmentordataRoutes from "./about__chiefmentordataRoutes.js";
import about__governingbodycouncildataRoutes from "./about__governingbodycouncildataRoutes.js";
import about__ourteamdataRoutes from "./about__ourteamdataRoutes.js";
import about__pressreleasesdataRoutes from "./about__pressreleasesdataRoutes.js";
import about__principaldataRoutes from "./about__principaldataRoutes.js";
import about__profileofcollegedataRoutes from "./about__profileofcollegedataRoutes.js";
import academics__academiccalendardataRoutes from "./academics__academiccalendardataRoutes.js";
import academics__departmentsdataRoutes from "./academics__departmentsdataRoutes.js";
import academics__pgprogrammsdetailsRoutes from "./academics__pgprogrammsdetailsRoutes.js";
import academics__prospectusdataRoutes from "./academics__prospectusdataRoutes.js";
import academics__ugprogramsdatadetailsRoutes from "./academics__ugprogramsdatadetailsRoutes.js";
import academics__valueaddedcoursesdataRoutes from "./academics__valueaddedcoursesdataRoutes.js";
import campus_life__seeddataRoutes from "./campus-life__seeddataRoutes.js";
import committees__committiesdataRoutes from "./committees__committiesdataRoutes.js";
import contact__contactdataRoutes from "./contact__contactdataRoutes.js";
import events__eventsdataRoutes from "./events__eventsdataRoutes.js";
import events__upcommingeventspreviewdataRoutes from "./events__upcommingeventspreviewdataRoutes.js";
import home__achievementsstatsdataRoutes from "./home__achievementsstatsdataRoutes.js";
import home__admissionsdataRoutes from "./home__admissionsdataRoutes.js";
import home__carouseldataRoutes from "./home__carouseldataRoutes.js";
import home__circularpreviewdataRoutes from "./home__circularpreviewdataRoutes.js";
import home__missionvisiondataRoutes from "./home__missionvisiondataRoutes.js";
import home__newstickerdataRoutes from "./home__newstickerdataRoutes.js";
import home__ourcampusdataRoutes from "./home__ourcampusdataRoutes.js";
import home__ourleadsRoutes from "./home__ourleadsRoutes.js";
import home__ourschoolscollegesdataRoutes from "./home__ourschoolscollegesdataRoutes.js";
import home__recruitersdataRoutes from "./home__recruitersdataRoutes.js";
import home__testimonialdataRoutes from "./home__testimonialdataRoutes.js";
import home__welcomedataRoutes from "./home__welcomedataRoutes.js";
import iqac__nirfdataRoutes from "./iqac__nirfdataRoutes.js";
import placements__placementrecordsRoutes from "./placements__placementrecordsRoutes.js";
import placements__trainingandplacementsdataRoutes from "./placements__trainingandplacementsdataRoutes.js";

const router = express.Router();

router.use("/about/chiefmentordata", about__chiefmentordataRoutes);
router.use(
  "/about/governingbodycouncildata",
  about__governingbodycouncildataRoutes
);
router.use("/about/ourteamdata", about__ourteamdataRoutes);
router.use("/about/pressreleasesdata", about__pressreleasesdataRoutes);
router.use("/about/principaldata", about__principaldataRoutes);
router.use("/about/profileofcollegedata", about__profileofcollegedataRoutes);
router.use(
  "/academics/academiccalendardata",
  academics__academiccalendardataRoutes
);
router.use("/academics/departmentsdata", academics__departmentsdataRoutes);
router.use(
  "/academics/pgprogrammsdetails",
  academics__pgprogrammsdetailsRoutes
);
router.use("/academics/prospectusdata", academics__prospectusdataRoutes);
router.use(
  "/academics/ugprogramsdatadetails",
  academics__ugprogramsdatadetailsRoutes
);
router.use(
  "/academics/valueaddedcoursesdata",
  academics__valueaddedcoursesdataRoutes
);
router.use("/campus-life/seeddata", campus_life__seeddataRoutes);
router.use("/committees/committiesdata", committees__committiesdataRoutes);
router.use("/contact/contactdata", contact__contactdataRoutes);
router.use("/events/eventsdata", events__eventsdataRoutes);
router.use(
  "/events/upcommingeventspreviewdata",
  events__upcommingeventspreviewdataRoutes
);
router.use("/home/achievementsstatsdata", home__achievementsstatsdataRoutes);
router.use("/home/admissionsdata", home__admissionsdataRoutes);
router.use("/home/carouseldata", home__carouseldataRoutes);
router.use("/home/circularpreviewdata", home__circularpreviewdataRoutes);
router.use("/home/missionvisiondata", home__missionvisiondataRoutes);
router.use("/home/newstickerdata", home__newstickerdataRoutes);
router.use("/home/ourcampusdata", home__ourcampusdataRoutes);
router.use("/home/ourleads", home__ourleadsRoutes);
router.use("/home/ourschoolscollegesdata", home__ourschoolscollegesdataRoutes);
router.use("/home/recruitersdata", home__recruitersdataRoutes);
router.use("/home/testimonialdata", home__testimonialdataRoutes);
router.use("/home/welcomedata", home__welcomedataRoutes);
router.use("/iqac/nirfdata", iqac__nirfdataRoutes);
router.use("/placements/placementrecords", placements__placementrecordsRoutes);
router.use(
  "/placements/trainingandplacementsdata",
  placements__trainingandplacementsdataRoutes
);

export default router;
