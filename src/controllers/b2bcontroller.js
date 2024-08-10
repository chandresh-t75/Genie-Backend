import mongoose from 'mongoose';
import { Retailer } from '../models/retailer.model.js';

export const getAllRetailers = async (req, res) => {
    try {
        const retailers = await Retailer.find({});
        if (retailers && retailers.length > 0)
            return res.status(200).json(retailers);
        else
            return res.status(404).json({ message: "No retailers found!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const onboardingRetailers = async (req, res) => {
    try {
        const onboardingRetailers = await Retailer.find({ storeApproved: false });
        if (onboardingRetailers && onboardingRetailers.length > 0)
            return res.status(200).json(onboardingRetailers);
        else
            return res.status(404).json({ message: "No unapproved retailers found!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const approvedRetailers = async (req, res) => {
    try {
        const approvedRetailers = await Retailer.find({ storeApproved: true});
        if (approvedRetailers && approvedRetailers.length > 0)
            return res.status(200).json(approvedRetailers);
        else
            return res.status(404).json({ message: "No approved retailers found!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

