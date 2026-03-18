/**
 * Regency Diagnostics / Shivanya Lifecare – Health checkup packages
 * Single source of truth: name, tests, MRP, offer price, parameter count
 */
(function (global) {
  'use strict';

  var PACKAGES = [
    // —— Super Fit series (comparison chart) ——
    {
      id: 'super-fit-01',
      name: 'Basic Wellness',
      description: 'Essential screening: blood sugar, thyroid, lipid profile, liver & kidney function.',
      tests: ['Sugar Fasting', 'Thyroid Profile Total', 'Lipid Profile', 'Liver Function Test', 'Kidney Function Test'],
      parameterCount: 37,
      mrp: 3095,
      offerPrice: 1000,
      badge: 'Popular'
    },
    {
      id: 'super-fit-02',
      name: 'Basic Wellness + CBC & HbA1c',
      description: 'Above plus complete blood count and diabetes marker (HbA1c).',
      tests: ['Sugar Fasting', 'Thyroid Profile Total', 'Lipid Profile', 'Liver Function Test', 'Kidney Function Test', 'CBC', 'HbA1C'],
      parameterCount: 60,
      mrp: 5190,
      offerPrice: 1300,
      badge: null
    },
    {
      id: 'super-fit-03',
      name: 'Wellness + Vitamins (D & B12)',
      description: 'Blood sugar, thyroid, lipid profile, liver & kidney function, plus Vitamin D and Vitamin B12.',
      tests: ['Sugar Fasting', 'Thyroid Profile Total', 'Lipid Profile', 'Liver Function Test', 'Kidney Function Test', 'Vitamin-D', 'Vitamin-B12'],
      parameterCount: 39,
      mrp: 6800,
      offerPrice: 2000,
      badge: null
    },
    {
      id: 'super-fit-04',
      name: 'Advanced Wellness',
      description: 'Super Fit 03 plus CBC, HbA1c and ESR – 10 parameter categories.',
      tests: ['Sugar Fasting', 'Thyroid Profile Total', 'Lipid Profile', 'Liver Function Test', 'Kidney Function Test', 'CBC', 'HbA1C', 'Vitamin-D', 'Vitamin-B12', 'E.S.R'],
      parameterCount: 63,
      mrp: 8105,
      offerPrice: 2300,
      badge: null
    },
    {
      id: 'fit-complete',
      name: 'Complete Wellness (Full Body)',
      description: 'All 14 parameters: above plus iron profile, HsCRP, amylase and urine R/M.',
      tests: ['Sugar Fasting', 'Thyroid Profile Total', 'Lipid Profile', 'Liver Function Test', 'Kidney Function Test', 'CBC', 'HbA1C', 'Vitamin-D', 'Vitamin-B12', 'E.S.R', 'Iron Profile', 'HsCRP', 'Amylase', 'Urine R/M'],
      parameterCount: 93,
      mrp: 10945,
      offerPrice: 3300,
      badge: 'Best value'
    },
    // —— Lite & specialty (flyer 2) ——
    {
      id: 'regency-lite',
      name: 'Lite Check',
      description: 'Quick screening: complete hemogram, TSH, urine R/M, HbA1c.',
      tests: ['Complete Hemogram', 'TSH', 'Urine R/M', 'Glycated Hemoglobin (HbA1c)'],
      parameterCount: 48,
      mrp: 1375,
      offerPrice: 689,
      badge: null
    },
    {
      id: 'pcod-profile',
      name: 'PCOD Profile',
      description: 'Hormonal and metabolic panel for PCOD: testosterone, FBS, insulin, FSH, LH, prolactin, thyroid.',
      tests: ['Testosterone total', 'Fasting Blood sugar (FBS)', 'Insulin Fasting', 'Complete Hemogram', 'ESR', 'Follicle stimulating Hormone', 'Luteinising Hormone', 'Serum Prolactin', 'Thyroid Profile'],
      parameterCount: 32,
      mrp: 4112,
      offerPrice: 1699,
      badge: null
    },
    {
      id: 'fever-panel-basic',
      name: 'Fever Panel – Basic',
      description: 'Fever workup: hemogram, ESR, Widal, urine analysis, malaria antigen.',
      tests: ['Complete Hemogram', 'ESR', 'Widal', 'Complete Urine Analysis-R/M', 'Malaria antigen'],
      parameterCount: 53,
      mrp: 1330,
      offerPrice: 599,
      badge: null
    },
    {
      id: 'fever-panel-advanced',
      name: 'Fever Panel – Advanced',
      description: 'Fever panel plus dengue NS1 antigen.',
      tests: ['Complete Hemogram', 'ESR', 'Widal', 'Complete Urine Analysis-R/M', 'Malaria antigen', 'Dengue NS 1 Antigen'],
      parameterCount: 54,
      mrp: 2310,
      offerPrice: 1249,
      badge: null
    },
    {
      id: 'pre-marital',
      name: 'Pre-Marital Check',
      description: 'HIV, Hepatitis B & C, VDRL (RPR), blood group and type.',
      tests: ['HIV', 'Hepatitis B Surface Antigen (HbsAg)', 'Hepatitis C Virus', 'VDRL (RPR)', 'Blood Group and Type'],
      parameterCount: 5,
      mrp: 2750,
      offerPrice: 899,
      badge: null
    },
    {
      id: 'male-wellness',
      name: 'Male Wellness',
      description: 'Full male health: hemogram, lipid, LFT, urine, PSA, HsCRP, diabetes, vitamins, kidney, iron, thyroid.',
      tests: ['Complete Hemogram', 'ESR', 'Lipid Profile', 'Liver Function Extended', 'Complete Urine Analysis-R/M', 'Cancer Markers (PSA)', 'HsCRP Quantitative', 'Fasting Blood Sugar', 'HbA1c', 'Vitamin B12', 'Kidney Function', 'Iron profile', 'Thyroid Profile', 'Vitamin D', 'RA Quantitative', 'Ferritin'],
      parameterCount: 95,
      mrp: 13325,
      offerPrice: 4799,
      badge: null
    },
    {
      id: 'female-wellness',
      name: 'Female Wellness',
      description: 'Full female health: hemogram, LFT, diabetes, urine, CA-125, HsCRP, vitamins, kidney, lipid, iron.',
      tests: ['Complete Hemogram', 'ESR', 'Liver Function Extended', 'Fasting Blood Sugar', 'HbA1c', 'Complete Urine Analysis-R/M', 'Cancer Markers (CA-125)', 'HsCRP Quantitative', 'RA Quantitative', 'Lipid Profile', 'Kidney Function', 'Thyroid Profile', 'Vitamin D', 'Vitamin B12', 'Ferritin', 'Iron profile'],
      parameterCount: 95,
      mrp: 14325,
      offerPrice: 5999,
      badge: null
    },
    {
      id: 'comprehensive-wellness',
      name: 'Comprehensive Wellness (Male/Female)',
      description: 'Full body check: hemogram, LFT, diabetes, urine, RA, HsCRP, allergy, kidney, lipid, thyroid, vitamins, amylase, iron.',
      tests: ['Complete Hemogram', 'ESR', 'Liver Function Extended', 'Fasting Blood Sugar', 'HbA1c', 'Complete Urine Analysis-R/M', 'RA Quantitative', 'HsCRP Quantitative', 'IgE Total (Allergy)', 'Kidney Function', 'Lipid Profile', 'Thyroid Profile', 'Vitamin B12', 'Vitamin D', 'Amylase', 'Iron profile'],
      parameterCount: 95,
      mrp: 12990,
      offerPrice: 4499,
      badge: null
    },
  
    // —— First Wellness & Heart (flyer 3) ——
    {
      id: 'first-wellness-01',
      name: 'First Wellness – Essential',
      description: 'Hemogram, ESR, lipid, LFT, kidney, fasting blood sugar, urine R/M.',
      tests: ['Complete Hemogram', 'ESR', 'Lipid Profile', 'Liver Function Extended', 'Kidney Function', 'Fasting blood sugar', 'Complete Urine Analysis-R/M'],
      parameterCount: 81,
      mrp: 4530,
      offerPrice: 1249,
      badge: null
    },
    {
      id: 'first-wellness-02',
      name: 'First Wellness + HbA1c',
      description: 'Above plus glycated hemoglobin (HbA1c).',
      tests: ['Complete Hemogram', 'ESR', 'Lipid Profile', 'Liver Function Extended', 'Kidney Function', 'Fasting blood sugar', 'Complete Urine Analysis-R/M', 'Glycated Hemoglobin (HbA1c)'],
      parameterCount: 82,
      mrp: 5275,
      offerPrice: 1299,
      badge: null
    },
    {
      id: 'first-wellness-03',
      name: 'First Wellness + Thyroid',
      description: 'Above plus complete thyroid profile.',
      tests: ['Complete Hemogram', 'ESR', 'Lipid Profile', 'Liver Function Extended', 'Kidney Function', 'Fasting Blood Sugar', 'Thyroid Profile', 'Complete Urine Analysis-R/M'],
      parameterCount: 84,
      mrp: 5250,
      offerPrice: 1349,
      badge: null
    },
    {
      id: 'heart-care',
      name: 'Heart Care Package',
      description: 'Cardiac screening: hemogram, lipid, FBS, Hs-CRP, HbA1c, CPK-MB.',
      tests: ['Complete Hemogram', 'Lipid Profile Standard', 'Fasting blood sugar', 'High Sensitive - CRP', 'Glycated Hemoglobin (HbA1c)', 'CPK - MB'],
      parameterCount: 37,
      mrp: 3450,
      offerPrice: 1249,
      badge: null
    },
    {
      id: 'extra-wellness-01',
      name: 'Extra Wellness – With Iron',
      description: 'First Wellness + HbA1c + thyroid + iron profile.',
      tests: ['Complete Hemogram', 'ESR', 'Liver Function Extended', 'Kidney Function', 'Fasting Blood Sugar', 'Thyroid Profile', 'Complete Urine Analysis-R/M', 'Glycated Hemoglobin (HbA1c)', 'Iron Profile', 'Lipid Profile'],
      parameterCount: 89,
      mrp: 7155,
      offerPrice: 1399,
      badge: null
    },
    {
      id: 'advanced-wellness-01',
      name: 'Advanced Wellness – With B12',
      description: 'Extra wellness plus Vitamin B12.',
      tests: ['Complete Hemogram', 'ESR', 'Liver Function Extended', 'Kidney Function', 'Fasting Blood Sugar', 'Complete Urine Analysis-R/M', 'Glycated Hemoglobin (HbA1c)', 'Thyroid Profile', 'Lipid Profile', 'Vitamin B12'],
      parameterCount: 86,
      mrp: 7980,
      offerPrice: 1799,
      badge: null
    },
    {
      id: 'advanced-wellness-02',
      name: 'Advanced Wellness – With Vitamin D',
      description: 'Advanced wellness with Vitamin D.',
      tests: ['Complete Hemogram', 'ESR', 'Liver Function Extended', 'Kidney Function', 'Fasting Blood Sugar', 'Vitamin B12', 'Complete Urine Analysis-R/M', 'Vitamin D', 'Lipid Profile'],
      parameterCount: 83,
      mrp: 7245,
      offerPrice: 1899,
      badge: null
    },
    {
      id: 'extra-wellness-02',
      name: 'Extra Wellness – With B12 & D',
      description: 'Comprehensive panel with vitamins: hemogram, LFT, KFT, diabetes, urine, iron, lipid, thyroid, B12, D.',
      tests: ['Complete Hemogram', 'ESR', 'Liver Function Extended', 'Kidney Function', 'Fasting Blood Sugar', 'Glycated Hemoglobin (HbA1c)', 'Complete Urine Analysis-R/M', 'Iron Profile', 'Lipid Profile', 'Thyroid Profile', 'Vitamin B12', 'Vitamin D'],
      parameterCount: 91,
      mrp: 10360,
      offerPrice: 2199,
      badge: null
    }
  ];

  function formatPrice(n) {
    return '₹' + Number(n).toLocaleString('en-IN');
  }

  function getById(id) {
    return PACKAGES.find(function (p) { return p.id === id; }) || null;
  }

  function getByName(name) {
    return PACKAGES.find(function (p) { return p.name === name; }) || null;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PACKAGES: PACKAGES, formatPrice: formatPrice, getById: getById, getByName: getByName };
  } else {
    global.PACKAGES_DATA = {
      PACKAGES: PACKAGES,
      formatPrice: formatPrice,
      getById: getById,
      getByName: getByName
    };
  }
})(typeof window !== 'undefined' ? window : this);
