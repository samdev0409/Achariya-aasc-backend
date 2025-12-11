import express from "express";
import About_chiefmentordataRoutes from "./about__chiefmentordataRoutes.js";
import About_governingbodycouncildataRoutes from "./about__governingbodycouncildataRoutes.js";
import About_ourteamdataRoutes from "./about__ourteamdataRoutes.js";
import About_pressreleasesdataRoutes from "./about__pressreleasesdataRoutes.js";
import About_principaldataRoutes from "./about__principaldataRoutes.js";
import About_profileofcollegedataRoutes from "./about__profileofcollegedataRoutes.js";
import Academics_academiccalendardataRoutes from "./academics__academiccalendardataRoutes.js";
import Academics_departmentsdataRoutes from "./academics__departmentsdataRoutes.js";
import Academics_pgprogrammsdetailsRoutes from "./academics__pgprogrammsdetailsRoutes.js";
import Academics_prospectusdataRoutes from "./academics__prospectusdataRoutes.js";
import Academics_ugprogramsdatadetailsRoutes from "./academics__ugprogramsdatadetailsRoutes.js";
import Academics_valueaddedcoursesdataRoutes from "./academics__valueaddedcoursesdataRoutes.js";
import CampusLife_seeddataRoutes from "./campus-life__seeddataRoutes.js";
import Committees_committiesdataRoutes from "./committees__committiesdataRoutes.js";
import Contact_contactdataRoutes from "./contact__contactdataRoutes.js";
import Events_eventsdataRoutes from "./events__eventsdataRoutes.js";
import Events_upcommingeventspreviewdataRoutes from "./events__upcommingeventspreviewdataRoutes.js";
import Home_achievementsstatsdataRoutes from "./home__achievementsstatsdataRoutes.js";
import Home_admissionsdataRoutes from "./home__admissionsdataRoutes.js";
import Home_allhomedataRoutes from "./home__allhomedataRoutes.js";
import Home_announcementsdataRoutes from "./home__announcementsdataRoutes.js";
import Home_carouseldataRoutes from "./home__carouseldataRoutes.js";
import Home_circularpreviewdataRoutes from "./home__circularpreviewdataRoutes.js";
import Home_missionvisiondataRoutes from "./home__missionvisiondataRoutes.js";
import Home_newstickerdataRoutes from "./home__newstickerdataRoutes.js";
import Home_ourcampusdataRoutes from "./home__ourcampusdataRoutes.js";
import Home_ourleadsRoutes from "./home__ourleadsRoutes.js";
import Home_ourschoolscollegesdataRoutes from "./home__ourschoolscollegesdataRoutes.js";
import Home_recruitersdataRoutes from "./home__recruitersdataRoutes.js";
import Home_testimonialdataRoutes from "./home__testimonialdataRoutes.js";
import Home_welcomedataRoutes from "./home__welcomedataRoutes.js";
import Iqac_nirfdataRoutes from "./iqac__nirfdataRoutes.js";
import Placements_placementrecordsRoutes from "./placements__placementrecordsRoutes.js";
import Placements_trainingandplacementsdataRoutes from "./placements__trainingandplacementsdataRoutes.js";

const router = express.Router();

router.use("/about__chiefmentordata", About_chiefmentordataRoutes);
router.use(
  "/about__governingbodycouncildata",
  About_governingbodycouncildataRoutes
);
router.use("/about__ourteamdata", About_ourteamdataRoutes);
router.use("/about__pressreleasesdata", About_pressreleasesdataRoutes);
router.use("/about__principaldata", About_principaldataRoutes);
router.use("/about__profileofcollegedata", About_profileofcollegedataRoutes);
router.use(
  "/academics__academiccalendardata",
  Academics_academiccalendardataRoutes
);
router.use("/academics__departmentsdata", Academics_departmentsdataRoutes);
router.use(
  "/academics__pgprogrammsdetails",
  Academics_pgprogrammsdetailsRoutes
);
router.use("/academics__prospectusdata", Academics_prospectusdataRoutes);
router.use(
  "/academics__ugprogramsdatadetails",
  Academics_ugprogramsdatadetailsRoutes
);
router.use(
  "/academics__valueaddedcoursesdata",
  Academics_valueaddedcoursesdataRoutes
);
router.use("/campus-life__seeddata", CampusLife_seeddataRoutes);
router.use("/committees__committiesdata", Committees_committiesdataRoutes);
router.use("/contact__contactdata", Contact_contactdataRoutes);
router.use("/events__eventsdata", Events_eventsdataRoutes);
router.use(
  "/events__upcommingeventspreviewdata",
  Events_upcommingeventspreviewdataRoutes
);
router.use("/home__achievementsstatsdata", Home_achievementsstatsdataRoutes);
router.use("/home__admissionsdata", Home_admissionsdataRoutes);
router.use("/home__allhomedata", Home_allhomedataRoutes);
router.use("/home__announcementsdata", Home_announcementsdataRoutes);
router.use("/home__carouseldata", Home_carouseldataRoutes);
router.use("/home__circularpreviewdata", Home_circularpreviewdataRoutes);
router.use("/home__missionvisiondata", Home_missionvisiondataRoutes);
router.use("/home__newstickerdata", Home_newstickerdataRoutes);
router.use("/home__ourcampusdata", Home_ourcampusdataRoutes);
router.use("/home__ourleads", Home_ourleadsRoutes);
router.use("/home__ourschoolscollegesdata", Home_ourschoolscollegesdataRoutes);
router.use("/home__recruitersdata", Home_recruitersdataRoutes);
router.use("/home__testimonialdata", Home_testimonialdataRoutes);
router.use("/home__welcomedata", Home_welcomedataRoutes);
router.use("/iqac__nirfdata", Iqac_nirfdataRoutes);
router.use("/placements__placementrecords", Placements_placementrecordsRoutes);
router.use(
  "/placements__trainingandplacementsdata",
  Placements_trainingandplacementsdataRoutes
);

export default router;
