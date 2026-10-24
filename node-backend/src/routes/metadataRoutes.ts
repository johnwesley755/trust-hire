import { Hono } from 'hono';
import * as metadataController from '../controllers/metadataController';
import * as locationController from '../controllers/locationController';

const router = new Hono();

// Dynamic Onboarding Dropdown Options
router.get('/options', metadataController.getOnboardingOptions);
router.get('/onboarding-options', metadataController.getOnboardingOptions);

// Dynamic 100% Location Hierarchy
router.get('/locations/states', locationController.getStates);
router.get('/locations/districts', locationController.getDistricts);
router.get('/locations/localities', locationController.getLocalities);
router.get('/locations/sub-districts', locationController.getLocalities);
router.get('/locations/pincode/:pincode', locationController.lookupPincode);
router.get('/locations/reverse-geocode', locationController.reverseGeocode);
router.get('/locations/search', locationController.searchPlaces);

export default router;
