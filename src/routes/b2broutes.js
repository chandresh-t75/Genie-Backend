import express from 'express';
import { approvedRetailers, getAllRetailers, onboardingRetailers } from '../controllers/b2bcontroller.js';


const router = express.Router();

router.route('/all-retailers').get(getAllRetailers);
router.route('/onboarding-retailers').get(onboardingRetailers)
router.route('/approved-retailers').get(approvedRetailers)






export default router;
