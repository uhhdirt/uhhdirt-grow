import React, { useState, useEffect, useMemo } from 'react';
import { supabase, GROW_ID, isCloud } from './supabaseClient.js';
import { Sprout, Calendar, Activity, BookOpen, CheckCircle2, Circle, Upload, ChevronRight, AlertCircle, TrendingUp, Camera, X, Info, Thermometer, Droplets, Wind } from 'lucide-react';

// ============================================
// THE FULL SOP — Pomelo Punch, v7
// ============================================
const SOP = {
  grow: {
    strain: 'Pomelo Punch',
    breeder: 'Bloom Seed Co. (Orange Mints × Papaya)',
    plantCount: 2,
    container: 'City Picker SIP, ~12-15 gal',
    soil: 'BAS 3.0 + KIS re-amend + Bokashi additions',
    light: 'Spider Farmer SE4500',
    expectedFlowerWeeks: 8,
    expectedVegWeeks: 5,
    notes: 'Caryophyllene-dominant with limonene. Tropical citrus/grapefruit/papaya. Heavy trichomes (Papaya lineage). Indica-leaning, bushy, ~24% THC, 8-9 wk. Chop 80-90% cloudy, 10-20% amber.',
    wateringNote: 'Mix 1 full gallon at the per-gallon rates, then pour ~½ gallon into EACH picker (2 pickers = 1 gallon total, correct dose each). Pour slowly + evenly. Do NOT chase with plain water. Reservoir handles deep moisture; top-water just feeds the upper root zone.',
  },
  weeks: [
    {
      id: 'clone', label: 'Clone', phase: 'clone', stage: 'Solo cup — wait for roots',
      tempOn: '75-78', rhOn: '65-70', vpdOn: '0.4-0.6', tempOff: '72-75', rhOff: '65-70', vpdOff: '0.4-0.6',
      light: '15-30% · PAR 100-150', lightHeight: '28-30" above plant',
      tasks: {
        feed: ['Plain water only OR water + Quillaja ¼ tsp/gal', 'No nutrients — clone has no roots yet to process them'],
        action: [
          'Set light schedule: 18/6 (ON 6am–12am, OFF 12am–6am)',
          'Set light 28-30" above the TOP of the clone (measure panel-to-canopy)',
          'PAR meter at canopy: target 100-150 µmol/m²/s (low end — clones stress easily)',
          'Dim light to hit PAR target — likely 15-25% since your panel is strong (let the meter decide, not the %)',
          'Place solo cups in tent',
          'Water lightly every 1-2 days — lift cup to check weight'
        ],
        environment: ['75-78°F, 65-70% RH', 'No dome needed if tent humidity is 65%+', 'Tent fan on low — gentle air movement'],
        watchFor: ['Roots poking through bottom drainage holes = transplant time', 'Wilting = needs water (cups dry fast)', 'Yellowing = normal for first 2-3 days as clone adjusts', 'New top growth = roots are establishing', 'Leaf tips bleaching/curling = too much light, dim further or raise'],
      },
      whyMatters: 'Clone has no root system yet — it\'s drinking through its leaves. No nutrients, no pressure. Gentle light is critical: aim PAR 100-150 at canopy. Your panel is strong so you\'ll likely run a low dim % to get there — trust the PAR meter over the percentage. Warm humid air + gentle light until roots show.',
    },
    {
      id: 'veg1', label: 'Veg 1', phase: 'veg', stage: 'Establish',
      tempOn: '75-80', rhOn: '60-65', vpdOn: '0.8-1.0', tempOff: '68-72', rhOff: '65-70', vpdOff: '0.6-0.8',
      light: '30-50% · PAR 200-300', lightHeight: '30"+',
      tasks: {
        feed: ['Plain water + Quillaja ¼ tsp/gal'],
        action: ['Transplant clones', 'Dust Microbe+ or Microbe Complete on root ball', '🦟 WDG3000 drench (label rate) — patio soil = high gnat risk', '🦟 Mosquito Bits on surface under mulch'],
        environment: ['AC running for comfort', 'Verify exhaust fan working'],
        watchFor: ['💧 DAILY: Check soil moisture by feel (1-2" deep) — water with Quillaja if approaching dry', 'New growth at top within 5-7 days', 'Roots establishing — slight droop normal first 24hr'],
      },
      whyMatters: 'Roots establish first. Don\'t push the plant — biology needs to wake up too.',
    },
    {
      id: 'veg2', label: 'Veg 2', phase: 'veg', stage: 'Develop roots',
      tempOn: '75-80', rhOn: '60-65', vpdOn: '0.8-1.0', tempOff: '68-72', rhOff: '65-70', vpdOff: '0.6-0.8',
      light: '50% · PAR 400-500', lightHeight: '24"',
      tasks: {
        feed: ['Big 6 Microbes ½ tsp/gal', 'Coconut Powder ¼ tsp/gal', 'Quillaja ¼ tsp/gal'],
        action: ['Light feed — biology still establishing', '🦟 WDG3000 drench (every 7-10 days)'],
        environment: ['Bump light dim % gradually'],
        watchFor: ['💧 DAILY: Check soil moisture by feel (1-2" deep) — water with Quillaja if approaching dry', 'First true leaves expanding', 'Healthy green color'],
      },
      whyMatters: 'You\'re feeding the microbes more than the plant right now. Light dose, build the food web.',
    },
    {
      id: 'veg3', label: 'Veg 3', phase: 'veg', stage: 'Top + LST starts',
      tempOn: '76-80', rhOn: '60-65', vpdOn: '0.9-1.1', tempOff: '68-72', rhOff: '62-68', vpdOff: '0.7-0.9',
      light: '60% · PAR 500-600', lightHeight: '20-24"',
      tasks: {
        feed: ['BuildAVeg ½ tsp/gal', 'Big 6 Microbes ½ tsp/gal', 'Coconut Powder ½ tsp/gal', 'N Humate 30ml/gal (Bokashi)', 'Quillaja ¼ tsp/gal'],
        action: ['🔪 FIRST TOP at 5th-6th node', 'Begin LST as branches reach 4-5"', '🦟 WDG3000 drench (every 7-10 days)', '🦟 Refresh Mosquito Bits if thin'],
        environment: ['Light to 60%', 'Light height 20-24"'],
        watchFor: ['💧 DAILY: Check soil moisture by feel (1-2" deep) — water with Quillaja if approaching dry', 'Recovery from topping in 3-5 days', 'Side branches starting to fill out'],
      },
      whyMatters: 'Topping doubles your main colas. N Humate boost helps the plant bounce back fast from the cut.',
    },
    {
      id: 'veg4', label: 'Veg 4', phase: 'veg', stage: 'Canopy fill',
      tempOn: '78-80', rhOn: '58-62', vpdOn: '1.0-1.2', tempOff: '68-72', rhOff: '60-65', vpdOff: '0.8-1.0',
      light: '70% · PAR 600-700', lightHeight: '20"',
      tasks: {
        feed: ['BuildAVeg ½ tsp/gal', 'Coconut Powder ½ tsp/gal', 'Quillaja ¼ tsp/gal'],
        action: ['🔪 SECOND TOP — top each of the 2 main stems at their 3rd node (→ 4 main colas)', '🍽 TOP-DRESS: ¼ cup Craft Blend + handful castings per plant under mulch', '🕸 Install SCROG net 10-12" above bed', '🦟 WDG3000 drench (every 7-10 days)'],
        environment: ['Light to 70%'],
        watchFor: ['💧 DAILY: Check soil moisture by feel (1-2" deep) — water with Quillaja if approaching dry', 'Canopy filling the scrog 50-70%', 'Multiple bud sites forming below net'],
      },
      whyMatters: 'Top-dress is slow-release. It needs time to break down — that\'s why we dose now, not at flip.',
    },
    {
      id: 'veg5', label: 'Veg 5', phase: 'veg', stage: 'Pre-flip',
      tempOn: '78-80', rhOn: '58-62', vpdOn: '1.0-1.2', tempOff: '68-72', rhOff: '58-62', vpdOff: '0.9-1.1',
      light: '70-80% · PAR 700-800', lightHeight: '18-20"',
      tasks: {
        feed: ['BuildAVeg ¼ tsp/gal', 'BuildABloom ⅛ tsp/gal', 'Big 6 Microbes ½ tsp/gal', 'Coconut Powder ½ tsp/gal', 'Complex Humate 30ml/gal (Bokashi)', 'Quillaja ¼ tsp/gal'],
        action: ['✂️ Light defoliation', '🍭 Lollipop bottom third', 'Final LST adjustments', '🦟 WDG3000 drench (every 7-10 days)', '🦟 Refresh Mosquito Bits'],
        environment: ['Drop RH toward 55%'],
        watchFor: ['💧 DAILY: Check soil moisture by feel (1-2" deep) — water with Quillaja if approaching dry', 'Scrog 70-80% full', 'Plants ready to stretch'],
      },
      whyMatters: 'Last chance to clean up structure. Bottom popcorn is a tax on top buds — remove ruthlessly.',
    },
    {
      id: 'flip', label: 'Flip', phase: 'flower', stage: '12/12 begins',
      tempOn: '78-80', rhOn: '55-60', vpdOn: '1.0-1.2', tempOff: '68-70', rhOff: '50-55', vpdOff: '1.0-1.2',
      light: '80% · PAR 800-900', lightHeight: '18"',
      tasks: {
        feed: ['BuildABloom ¼ tsp/gal', 'Big 6 Microbes ½ tsp/gal', 'Bio Phos 3ml/gal', 'Molasses 1-2 ml/gal', 'Quillaja ¼ tsp/gal'],
        action: ['🌸 SWITCH LIGHT SCHEDULE to 12/12', '🍽 TOP-DRESS: ¼ cup BuildAFlower + ½" castings per plant', '🦟 WDG3000 drench (last regular gnat treatment)'],
        environment: ['Confirm light schedule changed'],
        watchFor: ['💧 DAILY: Check soil moisture by feel (1-2" deep) — water with Quillaja if approaching dry', 'Stretch begins within 5-7 days'],
      },
      whyMatters: 'Flip top-dress is critical — flower amendments need 2-3 weeks to cycle into plant-available form.',
    },
    {
      id: 'f1', label: 'F1', phase: 'flower', stage: 'Stretch starts',
      tempOn: '78-80', rhOn: '55-60', vpdOn: '1.0-1.2', tempOff: '68-70', rhOff: '50-55', vpdOff: '1.0-1.2',
      light: '80% · PAR 800-900', lightHeight: '18"',
      tasks: {
        feed: ['BuildABloom ¼ tsp/gal', 'Big 6 Microbes ½ tsp/gal', 'Bio Phos 3ml/gal', 'Molasses 1-2 ml/gal', 'Quillaja ¼ tsp/gal'],
        action: ['🦟 WDG3000 drench (label rate) — gnat larvae', '🦟 Refresh Mosquito Bits on surface'],
        environment: ['Watch for plants doubling in height'],
        watchFor: ['💧 DAILY: Check soil moisture by feel (1-2" deep) — water with Quillaja if approaching dry', 'Pre-flowers showing', 'Rapid vertical growth'],
      },
      whyMatters: 'Stretch lasts 2-3 weeks. The plant can grow 50-200%. Make sure scrog can handle it.',
    },
    {
      id: 'f2', label: 'F2', phase: 'flower', stage: 'Stretch continues',
      tempOn: '78-80', rhOn: '55-60', vpdOn: '1.0-1.2', tempOff: '68-70', rhOff: '50-55', vpdOff: '1.0-1.2',
      light: '80-85% · PAR 800-900', lightHeight: '18"',
      tasks: {
        feed: ['BuildABloom ¼ tsp/gal', 'Big 6 Microbes ½ tsp/gal', 'Bio Phos 3ml/gal', 'CalSil+ per label (Bokashi) — STARTS here', 'Molasses 1-2 ml/gal', 'Quillaja ¼ tsp/gal'],
        action: ['Continue weaving branches through scrog'],
        environment: ['Pull RH slightly lower'],
        watchFor: ['💧 DAILY: Check soil moisture by feel (1-2" deep) — water with Quillaja if approaching dry', 'Bud sites forming at every node', 'White pistils emerging'],
      },
      whyMatters: 'CalSil+ starts here. Calcium = strong stems + better trichome stalks. Critical for the heavy flower coming.',
    },
    {
      id: 'f3', label: 'F3', phase: 'flower', stage: 'Stretch ends',
      tempOn: '78-80', rhOn: '55-60', vpdOn: '1.0-1.2', tempOff: '68-70', rhOff: '50-55', vpdOff: '1.0-1.2',
      light: '85% · PAR 850-950', lightHeight: '16-18"',
      tasks: {
        feed: ['BuildABloom ¼ tsp/gal', 'Bio Phos 5ml/gal', 'Microbe Complete or Microbe+ ½ tsp/gal', 'K Humate 15ml/gal (Bokashi)', 'Quillaja ¼ tsp/gal', '⚠️ SKIP Molasses — K Humate covers K this week'],
        action: ['✂️ DAY 21 STRIP — aggressive defoliation', 'Open up canopy airflow', '🦟 Final WDG3000 if gnats still present (stop after this)'],
        environment: ['Begin tightening environment'],
        watchFor: ['💧 DAILY: Check soil moisture by feel (1-2" deep) — water with Quillaja if approaching dry', 'Stretch ending — switch to outward bud growth', 'Plants stop getting taller'],
      },
      whyMatters: 'Day 21 strip opens light penetration and airflow. K Humate addresses last grow\'s P/K deficit. Bio Phos ramps up for bud building.',
    },
    {
      id: 'f4', label: 'F4', phase: 'flower', stage: 'RESIN WINDOW',
      tempOn: '78-80', rhOn: '55-60', vpdOn: '1.0-1.2', tempOff: '68-70', rhOff: '50-55', vpdOff: '1.0-1.2',
      light: '90-100% · PAR 950-1100', lightHeight: '16-18"',
      tasks: {
        feed: ['BuildABloom ½ tsp/gal', 'Bio Phos 5ml/gal', 'Big 6 Microbes ½ tsp/gal', 'K Humate 15ml/gal', 'CalSil+ per label', 'Quillaja ¼ tsp/gal', '⚠️ SKIP Molasses — K Humate covers K this week'],
        action: ['🔥 PUSH LIGHT TO 90-100%', 'Verify temps holding under load'],
        environment: ['Both ACs running consistently if needed', 'Manage temps as light goes up'],
        watchFor: ['💧 DAILY: Check soil moisture by feel (1-2" deep) — water with Quillaja if approaching dry', 'First trichomes visible', 'Buds starting to bulk'],
      },
      whyMatters: 'F4 = last week of early flower / fattening warm. Hold 80°F lights-on to keep stretch finishing strong. Big environmental drop comes at F5 (the mid-flower transition). Push light intensity this week but stay warm + humid like early flower.',
    },
    {
      id: 'f5', label: 'F5', phase: 'flower', stage: '🌡️ Mid-flower transition — the big drop',
      tempOn: '75-78', rhOn: '50-55', vpdOn: '1.1-1.4', tempOff: '67-69', rhOff: '40-50', vpdOff: '1.0-1.3',
      light: '95-100% · PAR 1000-1100', lightHeight: '16-18"',
      tasks: {
        feed: ['BuildABloom ½ tsp/gal', 'Bio Phos 5ml/gal', 'Big 6 Microbes ½ tsp/gal', 'Molasses 1-2 ml/gal (last week)', 'Quillaja ¼ tsp/gal'],
        action: ['❄️ BIG ENVIRONMENT SHIFT — drop temps & RH, cold nights START now', 'Light defol only — targeted, don\'t strip'],
        environment: ['Drop lights-on 80°F → 75-78°F', 'Drop lights-off 73-75°F → 65°F (the big change)', 'Both ACs aggressive — this is the money week for AC budget'],
        watchFor: ['💧 DAILY: Check soil moisture by feel (1-2" deep) — water with Quillaja if approaching dry', 'Buds bulking visibly', 'Trichome density increasing'],
      },
      whyMatters: 'The big shift to mid-flower: drop temps to your room floor (67-69°F lights-off) and pull humidity down hard. Drier here protects dense Pomelo Punch buds from rot — your weakest link. 67-69°F is your real cold finish; don\'t chase lower, it\'s plenty.',
    },
    {
      id: 'f6', label: 'F6', phase: 'flower', stage: 'Ripening — hold the cold',
      tempOn: '75-78', rhOn: '50-55', vpdOn: '1.1-1.4', tempOff: '67-69', rhOff: '40-50', vpdOff: '1.0-1.3',
      light: '90% · PAR 900-1000', lightHeight: '18"',
      tasks: {
        feed: ['BuildABloom ¼ tsp/gal (taper)', 'Bio Phos 3ml/gal (taper)', 'Big 6 Microbes ½ tsp/gal', 'CalSil+ per label', 'Quillaja ¼ tsp/gal'],
        action: ['❄️ HOLD cold nights (began F5)', 'Stop Molasses', 'Run portable AC during lights-off'],
        environment: ['Lights-off target 65-68°F', 'Aim for 8-10°F day/night differential'],
        watchFor: ['💧 DAILY: Check soil moisture by feel (1-2" deep) — water with Quillaja if approaching dry', 'Color changes (anthocyanin if genetics allow)', 'Trichomes shifting from clear to milky'],
      },
      whyMatters: 'Hold the cool environment you set at F5. The cold-night protocol is the biggest improvement vs your last grow — terpene preservation + defensive resin. Stay disciplined, don\'t let temps creep back up.',
    },
    {
      id: 'f7', label: 'F7', phase: 'flower', stage: 'Terpene window',
      tempOn: '75-78', rhOn: '45-50', vpdOn: '1.2-1.5', tempOff: '67-69', rhOff: '40-48', vpdOff: '1.1-1.4',
      light: '85% · PAR 850-950', lightHeight: '18-20"',
      tasks: {
        feed: ['Plain water + Quillaja ¼ tsp/gal', 'CalSil+ final application (calcium demand peaks at high VPD finish)'],
        action: ['💡 DIM LIGHT TO 85%', 'Maintain cold nights aggressively'],
        environment: ['Both ACs maximum during lights-off', 'Light dim reduces stress for finish'],
        watchFor: ['💧 DAILY: Check soil moisture by feel (1-2" deep) — water with Quillaja if approaching dry', 'Pistils browning', 'Trichomes mostly milky', 'Smell loudest now'],
      },
      whyMatters: 'Final Ca application supports calcium demand at peak VPD. Light dim preserves the trichomes you\'ve built. No more NPK.',
    },
    {
      id: 'f8', label: 'F8', phase: 'flower', stage: 'Pre-harvest',
      tempOn: '73-76', rhOn: '45-50', vpdOn: '1.2-1.5', tempOff: '67-69', rhOff: '40-45', vpdOff: '1.2-1.4',
      light: '80% · PAR 850-950', lightHeight: '20"',
      tasks: {
        feed: ['Plain water only', 'Last water 24-48 hours before chop'],
        action: ['🔍 Check trichomes daily with loupe/scope', '📅 Plan chop day'],
        environment: ['Drop temps to 60-62°F for 24hr pre-chop if possible', 'Lights off 24-48hr pre-chop'],
        watchFor: ['💧 DAILY: Check soil moisture by feel (1-2" deep) — water with Quillaja if approaching dry', 'Trichomes 80-90% cloudy, 10-20% amber (TARGET)', 'Caryophyllene is heat-stable — can ripen a touch longer for fuller body'],
      },
      whyMatters: 'Pomelo Punch is caryophyllene-dominant and heat-stable, so you can ripen to 10-20% amber for fuller body without losing top notes. Watch trichomes, not the calendar.',
    },
    {
      id: 'harvest', label: 'Chop', phase: 'harvest', stage: 'Harvest day',
      tempOn: '60-62', rhOn: '50-55', vpdOn: '—', tempOff: '60-62', rhOff: '50-55', vpdOff: '—',
      light: 'Off', lightHeight: '—',
      tasks: {
        feed: ['No feeding — last water was 48hr ago'],
        action: [
          '✂️ Strip ALL fan leaves on BOTH plants (keep sugar leaves)',
          '🪓 PLANT A → Cannatrol — Option A1 (slow cold): 60°F dry bulb / 45°F dew point / 21-day slope dry',
          '🪓 PLANT A → Cannatrol — Option A2 (balanced fallback): 68°F / 57°F dew point / 10 days + 68°F / 54°F / 4 day cure',
          '🪓 PLANT B → Tent hang-dry: 70-72°F / 40-45% RH (fast-dry protocol)',
          'Plant B: hang whole plant intact, do NOT wet trim',
          '🧤 GLOVES FROM NOW ON — never touch buds bare-handed',
          '⚠️ CONFIRM with Cannatrol customer service which A profile is safe to run'
        ],
        environment: ['Tent cleaned + blacked out for Plant B', 'Portable AC + dehumidifier holding 70-72°F / 40-45%'],
        watchFor: ['Track plants separately', 'Both protocols deliberately compete head-to-head'],
      },
      whyMatters: 'A/B test of competing philosophies: slow cold cure (chlorophyll breakdown) vs fast warm dry (water activity + terpene preservation). Both protocols address what hurt Sour Irene. We need to know which one your space + your strains respond to better.',
    },
    {
      id: 'dry1', label: 'Dry 1', phase: 'dry', stage: 'Days 1-7 — both plants',
      tempOn: '60-72', rhOn: '40-55', vpdOn: '—', tempOff: '60-72', rhOff: '40-55', vpdOff: '—',
      light: 'Off', lightHeight: '—',
      tasks: {
        feed: [],
        action: [
          'Plant A (Cannatrol): monitor setpoints holding correctly',
          'Plant B (Tent): daily check on temp + RH',
          'Plant B: stem snap test from day 6 onward'
        ],
        environment: [
          'Plant A chamber: per chosen profile (60°F slow OR 68°F balanced)',
          'Plant B tent: 70-72°F / 40-45% RH steady'
        ],
        watchFor: ['Plant B day 7-8: small stems snap = ready for rest jar phase', 'Plant A still in middle of cycle regardless of which profile'],
      },
      whyMatters: 'Plant B is fast (warm dry): aim to be at stem-snap by day 7-8. Plant A is slow (Cannatrol): just running its program — your job is to verify setpoints are holding.',
    },
    {
      id: 'dry2', label: 'Dry 2', phase: 'dry', stage: 'Days 8-21 — divergent paths',
      tempOn: '60-72', rhOn: '40-55', vpdOn: '—', tempOff: '60-72', rhOff: '40-55', vpdOff: '—',
      light: 'Off', lightHeight: '—',
      tasks: {
        feed: [],
        action: [
          'Plant B day 8-10: stem snap → move to REST JAR PHASE (mason jars or Tupperware, loose lid, 2-3 days same RH as dry room)',
          'Plant B day 10-11: trim in same room (matching RH)',
          'Plant B before final jar: water activity check (sample test jar, 12-24hr, target 55-62% reading)',
          'Plant A (Option A1): continues slope dry through day 21',
          'Plant A (Option A2): cure phase starts day 11, ends day 14',
          'Plant A at end: JAR SEALED EXTERNALLY in mason + Boveda 62% — do NOT continue lid-off in chamber'
        ],
        environment: ['Hold Plant B tent steady until trim', 'Plant A unit continues its program'],
        watchFor: ['Plant B: rehydration if moved to humid space (don\'t)', 'Plant A: setpoints not drifting'],
      },
      whyMatters: 'Plant B finishes around day 10-11. Plant A finishes day 14 (balanced) or day 21 (slow cold). The key fix vs last grow: JAR SEALED EXTERNALLY when each plant\'s cycle ends. No more lid-off in chamber.',
    },
    {
      id: 'cure1', label: 'Cure W1', phase: 'cure', stage: 'Initial sealed cure',
      tempOn: '60-62', rhOn: '60-62', vpdOn: '—', tempOff: '60-62', rhOff: '60-62', vpdOff: '—',
      light: 'Dark', lightHeight: '—',
      tasks: {
        feed: [],
        action: ['🫙 JAR at 75% fill', '🔄 Burp 2x daily, 5-10 min', 'Boveda 62% in each jar', 'LIDS ON — sealed cure', '🧤 Gloves only — never touch buds bare-handed'],
        environment: ['Cool dark storage', 'Cannatrol hold mode OK'],
        watchFor: ['Hay/ammonia smell = too wet, dump on tray briefly', 'Target 60-62% jar RH'],
      },
      whyMatters: 'Sealed cure is the #1 fix from last grow. Lid-off for weeks killed flavor. Burping = controlled, not constant exposure.',
    },
    {
      id: 'cure2', label: 'Cure W2', phase: 'cure', stage: 'Active cure',
      tempOn: '60-62', rhOn: '60-62', vpdOn: '—', tempOff: '60-62', rhOff: '60-62', vpdOff: '—',
      light: 'Dark', lightHeight: '—',
      tasks: {
        feed: [],
        action: ['Burp once daily, 5 min'],
        environment: ['Continue sealed cure'],
        watchFor: ['"Loud" smells starting to emerge', 'Chlorophyll fading'],
      },
      whyMatters: 'Week 2 is when terpenes start integrating. Don\'t over-burp — you\'re losing terps every open.',
    },
    {
      id: 'cure4', label: 'Cure W4', phase: 'cure', stage: 'Settling',
      tempOn: '60-65', rhOn: '60-62', vpdOn: '—', tempOff: '60-65', rhOff: '60-62', vpdOff: '—',
      light: 'Dark', lightHeight: '—',
      tasks: {
        feed: [],
        action: ['Burp every 2-3 days', '📝 First real smoke test — take notes'],
        environment: ['Can move out of Cannatrol if needed'],
        watchFor: ['Limonene-dominant strains often muted at W3-5'],
      },
      whyMatters: 'Give the cure time. Terpene-forward strains often have a muted phase weeks 3-5 before opening up at weeks 6-10.',
    },
    {
      id: 'cure8', label: 'Cure W8+', phase: 'cure', stage: 'Peak cure',
      tempOn: '60-65', rhOn: '60-62', vpdOn: '—', tempOff: '60-65', rhOff: '60-62', vpdOff: '—',
      light: 'Dark', lightHeight: '—',
      tasks: {
        feed: [],
        action: ['Burp weekly', '📝 Full smoke report — flavor, ash, burn, resin', 'Compare Plant A vs Plant B'],
        environment: ['Long-term sealed storage (wine fridge ideal)'],
        watchFor: ['"Loud" peak — this is when Pomelo Punch should sing', 'Document everything for next run'],
      },
      whyMatters: 'Weeks 6-10 of cure is peak for terpene-forward strains. Final A/B verdict happens here.',
    },
  ],
};

// ============================================
// COMPONENTS
// ============================================

const STORAGE_KEY = 'grow-tracker:pomelo-punch-v1';

// ============================================
// HISTORICAL GROWS — for comparison & learning
// ============================================
const HISTORICAL_GROWS = [
  {
    id: 'sour-irene-winter-2026',
    strain: 'Sour Irene',
    chopDate: '2026-03-25',
    yieldGrams: 147,
    yieldOz: (147 / 28.35).toFixed(2),
    aBudsGrams: null, // not separately tracked
    smallMedGrams: null,
    smokeReport: {
      flavor: 'Muted early, opened up mid-joint to peppery → sour',
      smoothness: 'Smooth on throat',
      ash: 'Solid burn',
      resin: 'Resin ring instant',
      potency: 'Strong',
      verdict: '✓ Structurally fine. Flavor depth limited by factory Cannatrol + heat in dry.',
    },
    grow: {
      lightSchedule: 'Inverted (lights on at night)',
      maxLightPct: '70%',
      coldFinish: 'No — lights-off averaged 73°F',
      dryMethod: 'Cannatrol factory settings (8 days)',
      cureMethod: 'Lids-off ~6 weeks',
      majorIssues: ['Broken exhaust fan Dec 15 – Jan 10 (4 weeks during stretch)'],
    },
  },
  {
    id: 'moroccan-peaches-winter-2026',
    strain: 'Moroccan Peaches',
    chopDate: '2026-03-18',
    yieldGrams: 75,
    yieldOz: (75 / 28.35).toFixed(2),
    aBudsGrams: 77,
    smallMedGrams: 70,
    smokeReport: {
      flavor: 'Really subtle — wanted more sweetness/smoothness',
      smoothness: 'Sharp back-of-palate itch, dry mouth',
      ash: 'Dry, sand-grain consistency (not cohesive)',
      resin: 'Good resin ring',
      potency: 'Medium — relaxing not overwhelming',
      verdict: '✗ Wispy structure, weak finish. Hydrophobic soil + heat + lid-off cure stacked.',
    },
    grow: {
      lightSchedule: 'Inverted (lights on at night)',
      maxLightPct: '70%',
      coldFinish: 'No — lights-off averaged 73°F',
      dryMethod: 'Cannatrol 7-day reset',
      cureMethod: 'Lids-off ~6 weeks',
      majorIssues: [
        'Broken exhaust fan Dec 15 – Jan 10',
        'Soil went hydrophobic — likely main driver of 2x lower yield',
        'Probable P/K deficit',
      ],
    },
  },
];

// Note: ratios above use yieldGrams. 147g/75g = 1.96x yield gap side-by-side same tent.

const defaultState = {
  growStartDate: null,
  currentWeekId: 'clone',
  completedTasks: {}, // { 'veg1:feed:0': true, ... }
  weeklyData: {}, // { 'veg1': { notes: '', photoUrl: '', envSummary: {}, observations: '' } }
  envReadings: [], // [{ week: 'veg1', tempOnAvg, tempOffAvg, rhOnAvg, rhOffAvg, vpdOnAvg, vpdOffAvg, sourceUploadDate }]
};

function StatusPill({ status, children }) {
  const colors = {
    good: 'bg-panel text-ink border-ink',
    warn: 'bg-amber-100 text-amber-800 border-amber-300',
    bad: 'bg-red-100 text-red border-red',
    neutral: 'bg-panel text-ink border-ink',
    info: 'bg-blue-100 text-ink border-blue-300',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colors[status] || colors.neutral}`}>
      {children}
    </span>
  );
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-paper rounded-xl border border-hair p-5 ${className}`}>
      {children}
    </div>
  );
}

function Progress({ currentIdx, totalCount, phaseColors }) {
  return (
    <div className="w-full">
      <div className="flex h-3 rounded-full overflow-hidden bg-panel border border-hair">
        {SOP.weeks.map((w, i) => {
          const color = phaseColors[w.phase];
          const opacity = i <= currentIdx ? 1 : 0.18;
          return (
            <div
              key={w.id}
              className="flex-1 transition-all border-r border-white last:border-r-0"
              style={{ background: color, opacity }}
              title={w.label}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-xs text-faded">
        <span>Clone</span>
        <span>Veg</span>
        <span>Flower</span>
        <span>Dry</span>
        <span>Cure</span>
      </div>
    </div>
  );
}

function TaskList({ week, completed, onToggle, wateringNote, canEdit }) {
  const sections = [
    { key: 'feed', label: 'Feed', icon: '🥄', color: 'text-red bg-panel border-hair' },
    { key: 'action', label: 'Actions', icon: '🛠', color: 'text-ink bg-panel border-purple-200' },
    { key: 'environment', label: 'Environment', icon: '🌡', color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { key: 'watchFor', label: 'Watch For', icon: '👀', color: 'text-[#9a7d1a] bg-[#f7f0d8] border-[#e3d59a]' },
  ];

  // Show the watering note above the Feed section only when this week has a real feed
  const hasFeed = (week.tasks.feed || []).some(f => !/^no feed|^plain water only/i.test(f));

  return (
    <div className="space-y-4">
      {sections.map(section => {
        const tasks = week.tasks[section.key] || [];
        if (tasks.length === 0) return null;
        return (
          <div key={section.key}>
            {section.key === 'feed' && hasFeed && wateringNote && (
              <div className="mb-2 p-3 rounded-lg bg-panel border border-hair text-xs text-ink leading-relaxed">
                <span className="font-semibold">💧 How to water in: </span>{wateringNote}
              </div>
            )}
            <div className={`font-cond text-xs font-bold uppercase tracking-widest mb-2 inline-block text-ink`}>
              {section.icon} {section.label}
            </div>
            <ul className="space-y-1.5">
              {tasks.map((task, idx) => {
                const taskId = `${week.id}:${section.key}:${idx}`;
                const isDone = !!completed[taskId];
                const isActionable = section.key === 'feed' || section.key === 'action' || section.key === 'environment';
                return (
                  <li key={idx} className="flex items-start gap-2.5 text-sm">
                    {isActionable ? (
                      <button
                        onClick={() => onToggle(taskId)}
                        disabled={!canEdit}
                        className={`mt-0.5 flex-shrink-0 w-[22px] h-[22px] border-2 border-void flex items-center justify-center transition-colors ${isDone ? 'bg-mag' : 'bg-white'} ${canEdit ? 'cursor-pointer hover:border-mag' : 'cursor-default'}`}
                        style={{ boxShadow: '2px 2px 0 #000' }}
                        aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {isDone && <span className="text-white font-bold text-sm leading-none">✓</span>}
                      </button>
                    ) : (
                      <span className="mt-0.5 flex-shrink-0 text-mag font-bold">›</span>
                    )}
                    <span className={`leading-relaxed ${isDone ? 'line-through text-faded' : 'text-ink'}`}>{task}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function WeekHeader({ week, weekIdx }) {
  const phaseLabel = {
    clone: 'Clone / Solo Cup',
    veg: 'Vegetative',
    flower: 'Flower',
    harvest: 'Harvest',
    dry: 'Drying',
    cure: 'Curing',
  };
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-medium text-faded uppercase tracking-wider mb-1">
        <span>Week {weekIdx + 1} of {SOP.weeks.length}</span>
        <span>·</span>
        <span>{phaseLabel[week.phase]}</span>
      </div>
      <h2 className="font-cond font-bold uppercase tracking-wide text-2xl text-ink pb-1.5 border-b border-ink">{week.label} — {week.stage}</h2>
    </div>
  );
}

function TargetGrid({ week }) {
  return (
    <div className="space-y-2">
      {/* Lights ON row */}
      <div className="rounded-lg bg-[#f7f0d8] border border-[#e3d59a] p-3">
        <div className="text-[10px] uppercase tracking-wide font-semibold text-[#9a7d1a] mb-1.5 flex items-center gap-1.5">
          <span>☀️ Lights ON</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="text-[10px] text-faded uppercase">Temp</div>
            <div className="text-sm font-semibold text-ink">{week.tempOn}°F</div>
          </div>
          <div>
            <div className="text-[10px] text-faded uppercase">RH</div>
            <div className="text-sm font-semibold text-ink">{week.rhOn}%</div>
          </div>
          <div>
            <div className="text-[10px] text-faded uppercase">VPD</div>
            <div className="text-sm font-semibold text-ink">{week.vpdOn}</div>
          </div>
        </div>
      </div>
      {/* Lights OFF row */}
      <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-3">
        <div className="text-[10px] uppercase tracking-wide font-semibold text-indigo-700 mb-1.5 flex items-center gap-1.5">
          <span>🌙 Lights OFF</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="text-[10px] text-faded uppercase">Temp</div>
            <div className="text-sm font-semibold text-ink">{week.tempOff}°F</div>
          </div>
          <div>
            <div className="text-[10px] text-faded uppercase">RH</div>
            <div className="text-sm font-semibold text-ink">{week.rhOff}%</div>
          </div>
          <div>
            <div className="text-[10px] text-faded uppercase">VPD</div>
            <div className="text-sm font-semibold text-ink">{week.vpdOff}</div>
          </div>
        </div>
      </div>
      {/* Light spec */}
      <div className="rounded-lg bg-paper border border-hair p-3 grid grid-cols-2 gap-2">
        <div>
          <div className="text-[10px] text-faded uppercase">Light intensity</div>
          <div className="text-sm font-semibold text-ink">{week.light}</div>
        </div>
        <div>
          <div className="text-[10px] text-faded uppercase">Light height</div>
          <div className="text-sm font-semibold text-ink">{week.lightHeight}</div>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// DASHBOARD VIEW
// =============================================================
// ============================================================
// CHANGES THIS WEEK — auto-advice from CSV vs targets + carry-forward
// ============================================================
function parseRange(str) {
  if (!str || str === '—') return null;
  const nums = String(str).match(/[\d.]+/g);
  if (!nums) return null;
  if (nums.length === 1) return { lo: parseFloat(nums[0]), hi: parseFloat(nums[0]) };
  return { lo: parseFloat(nums[0]), hi: parseFloat(nums[1]) };
}

// Your real equipment constraints
const ROOM_FLOOR = 67;     // room/tent won't reliably go below this
const AC_FLOOR = 64;       // portable AC hard minimum

function computeChanges(week, latestEnv, completedTasks) {
  const changes = [];

  if (latestEnv) {
    const tOn = parseRange(week.tempOn), tOff = parseRange(week.tempOff);
    const rOn = parseRange(week.rhOn), rOff = parseRange(week.rhOff);
    const vOn = parseRange(week.vpdOn), vOff = parseRange(week.vpdOff);
    const inFlower = week.phase === 'flower';

    // --- detect the temp+RH-both-high case (fix temp first) ---
    const tempOnHigh = tOn && latestEnv.tempOnAvg > tOn.hi + 1.5;
    const rhOnHigh = rOn && latestEnv.rhOnAvg > rOn.hi + 3;
    const tempOffHigh = tOff && latestEnv.tempOffAvg > tOff.hi + 1.5;
    const rhOffHigh = rOff && latestEnv.rhOffAvg > rOff.hi + 3;

    // TEMP — lights on
    if (tOn) {
      const v = latestEnv.tempOnAvg;
      if (v > tOn.hi + 1.5) {
        changes.push({ sev: 'med', text: `Lights-on temp ran ${v.toFixed(1)}°F — ${(v - tOn.hi).toFixed(0)}°F above target (${week.tempOn}°F). Lower day temp setpoint, or raise exhaust during lights-on to pull cooler room air through.` });
      } else if (v < tOn.lo - 1.5) {
        changes.push({ sev: 'low', text: `Lights-on temp ran ${v.toFixed(1)}°F — below target (${week.tempOn}°F). Raise day temp setpoint, or it may just be cool ambient (fine).` });
      }
    }
    // TEMP — lights off, with floor awareness
    if (tOff) {
      const v = latestEnv.tempOffAvg;
      if (v > tOff.hi + 1.5) {
        if (tOff.hi <= ROOM_FLOOR + 1) {
          changes.push({ sev: 'med', text: `Lights-off temp ran ${v.toFixed(1)}°F vs target ${week.tempOff}°F. You're near your room's ~${ROOM_FLOOR}°F floor — push night AC + exhaust as hard as you can, but ${ROOM_FLOOR}-${ROOM_FLOOR + 2}°F is a fine cold finish. Don't stress the last degree or two.` });
        } else {
          changes.push({ sev: 'med', text: `Lights-off temp ran ${v.toFixed(1)}°F — ${(v - tOff.hi).toFixed(0)}°F above target (${week.tempOff}°F). Lower night temp setpoint.` });
        }
      } else if (v < tOff.lo - 1.5) {
        changes.push({ sev: 'low', text: `Lights-off temp ran ${v.toFixed(1)}°F — below target (${week.tempOff}°F). Fine if plants look happy; raise night setpoint only if you want it warmer.` });
      }
    }

    // RH — lights on. If temp is also high, tell them to fix temp first.
    if (rOn) {
      const v = latestEnv.rhOnAvg;
      if (v > rOn.hi + 3) {
        let msg = `Lights-on RH ran ${v.toFixed(0)}% — ${(v - rOn.hi).toFixed(0)}% above target (${week.rhOn}%).`;
        if (tempOnHigh) msg += ' Temp is also high — fix the temp first; RH often drops with it. Then dehumidify if still high.';
        else msg += ' Raise dehumidifier / lower humidity setpoint.';
        if (inFlower) msg += ' ⚠️ High RH in flower = bud-rot risk on dense buds. Treat as priority.';
        changes.push({ sev: inFlower ? 'high' : 'med', text: msg });
      } else if (v < rOn.lo - 3) {
        changes.push({ sev: 'low', text: `Lights-on RH ran ${v.toFixed(0)}% — below target (${week.rhOn}%). Bump humidifier up. Low RH spikes VPD and stresses growth.` });
      }
    }
    // RH — lights off
    if (rOff) {
      const v = latestEnv.rhOffAvg;
      if (v > rOff.hi + 3) {
        let msg = `Lights-off RH ran ${v.toFixed(0)}% — ${(v - rOff.hi).toFixed(0)}% above target (${week.rhOff}%).`;
        if (tempOffHigh) msg += ' Night temp also high — improve airflow; RH and temp drop together at night.';
        else msg += ' Raise night dehumidification + keep air moving.';
        if (inFlower) msg += ' ⚠️ Night RH is the #1 mold driver in flower. Priority.';
        changes.push({ sev: inFlower ? 'high' : 'med', text: msg });
      }
    }

    // VPD — informational only, and skip at night (no plant pressure when lights off)
    if (vOn) {
      const v = latestEnv.vpdOnAvg;
      if (v > vOn.hi + 0.2) changes.push({ sev: 'low', text: `Lights-on VPD ${v.toFixed(2)} — above target (${week.vpdOn}). Usually means too dry/hot. Fix via the temp/RH advice above; VPD is the result, not a setpoint.` });
      else if (v < vOn.lo - 0.2) changes.push({ sev: 'low', text: `Lights-on VPD ${v.toFixed(2)} — below target (${week.vpdOn}). Too humid/cool. Again, fix temp/RH; VPD follows.` });
    }

    if (changes.length === 0) {
      changes.push({ sev: 'ok', text: 'Environment was on-target last upload. No setpoint changes needed — hold steady.' });
    }
  }

  // Carry-forward unchecked tasks
  const carry = [];
  ['action', 'feed', 'environment'].forEach(key => {
    (week.tasks[key] || []).forEach((task, idx) => {
      const id = `${week.id}:${key}:${idx}`;
      if (!completedTasks[id]) carry.push({ key, task });
    });
  });

  return { changes, carry, hasEnv: !!latestEnv };
}

function ChangesThisWeek({ week, latestEnv, completedTasks }) {
  const { changes, carry, hasEnv } = computeChanges(week, latestEnv, completedTasks);
  const sevStyle = {
    high: 'bg-[#fbeae9] border-red text-ink',
    med: 'bg-[#f7f0d8] border-[#e3d59a] text-ink',
    ok: 'bg-panel border-hair text-ink',
  };
  return (
    <Card className="border-ink">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-cond font-bold uppercase tracking-wide text-base text-ink">Changes to Make This Week</h3>
        {!hasEnv && <span className="text-[10px] text-faded uppercase tracking-wide">upload CSV for advice</span>}
      </div>

      {!hasEnv ? (
        <p className="text-sm text-faded">Upload this week's AC Infinity CSV in the Environment tab to get setpoint advice based on how your actuals compared to target.</p>
      ) : (
        <div className="space-y-2 mb-3">
          {changes.map((c, i) => (
            <div key={i} className={`p-2.5 rounded-lg border text-sm leading-relaxed ${sevStyle[c.sev]}`}>{c.text}</div>
          ))}
        </div>
      )}

      {carry.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-faded mb-1.5">Still to do this week ({carry.length})</div>
          <ul className="space-y-1">
            {carry.slice(0, 8).map((c, i) => (
              <li key={i} className="text-sm text-faded flex items-start gap-1.5">
                <span className="text-hair mt-0.5">○</span>
                <span>{c.task}</span>
              </li>
            ))}
            {carry.length > 8 && <li className="text-xs text-faded">+ {carry.length - 8} more in the task list below</li>}
          </ul>
        </div>
      )}
    </Card>
  );
}

function Dashboard({ state, setState, canEdit }) {
  const rawIdx = SOP.weeks.findIndex(w => w.id === state.currentWeekId);
  const currentIdx = rawIdx === -1 ? 0 : rawIdx;
  const currentWeek = SOP.weeks[currentIdx];
  const nextWeek = SOP.weeks[currentIdx + 1];

  const phaseColors = {
    clone: '#a3e635',
    veg: '#84cc16',
    flower: '#14b8a6',
    harvest: '#a855f7',
    dry: '#f59e0b',
    cure: '#0ea5e9',
  };

  const toggleTask = (taskId) => {
    if (!canEdit) return;
    setState(prev => ({
      ...prev,
      completedTasks: { ...prev.completedTasks, [taskId]: !prev.completedTasks[taskId] }
    }));
  };

  // Stats
  const allTaskIds = ['feed', 'action', 'environment'].flatMap(key =>
    (currentWeek.tasks[key] || []).map((_, idx) => `${currentWeek.id}:${key}:${idx}`)
  );
  const doneCount = allTaskIds.filter(id => state.completedTasks[id]).length;
  const totalCount = allTaskIds.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  // Days since start
  const daysSinceStart = state.growStartDate
    ? Math.floor((Date.now() - new Date(state.growStartDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Latest environment reading for current week
  const latestEnv = state.envReadings.filter(r => r.week === currentWeek.id).slice(-1)[0];

  const advanceWeek = () => {
    if (currentIdx < SOP.weeks.length - 1) {
      setState(prev => ({ ...prev, currentWeekId: SOP.weeks[currentIdx + 1].id }));
    }
  };

  const previousWeek = () => {
    if (currentIdx > 0) {
      setState(prev => ({ ...prev, currentWeekId: SOP.weeks[currentIdx - 1].id }));
    }
  };

  return (
    <div className="space-y-5">
      {/* Hero card */}
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-hair">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-red font-semibold mb-1">Current grow</div>
            <h1 className="text-2xl font-semibold text-ink">{SOP.grow.strain}</h1>
            <p className="text-sm text-faded mt-0.5">{SOP.grow.breeder}</p>
          </div>
          <div className="text-right">
            {daysSinceStart !== null && (
              <>
                <div className="text-3xl font-semibold text-red">{daysSinceStart}</div>
                <div className="text-xs text-faded">days in</div>
              </>
            )}
          </div>
        </div>
        <Progress currentIdx={currentIdx} totalCount={SOP.weeks.length} phaseColors={phaseColors} />
      </Card>

      {/* Changes to make this week */}
      <ChangesThisWeek week={currentWeek} latestEnv={latestEnv} completedTasks={state.completedTasks} />

      {/* Current week */}
      <Card>
        <div className="flex items-start justify-between mb-4">
          <WeekHeader week={currentWeek} weekIdx={currentIdx} />
          <div className="flex gap-1">
            <button onClick={previousWeek} disabled={currentIdx === 0} className="px-2 py-1 text-xs rounded border border-hair text-faded hover:bg-paper disabled:opacity-30">← Prev</button>
            <button onClick={advanceWeek} disabled={currentIdx === SOP.weeks.length - 1} className="px-2 py-1 text-xs rounded border border-hair text-faded hover:bg-paper disabled:opacity-30">Next →</button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-faded">This week's tasks</span>
            <span className="font-medium text-ink">{doneCount} of {totalCount} done · {pct}%</span>
          </div>
          <div className="h-2 bg-panel rounded-full overflow-hidden">
            <div className="h-full bg-panel0 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Targets */}
        <div className="mb-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-faded mb-2">Target environment</div>
          <TargetGrid week={currentWeek} />
        </div>

        {/* Why this matters */}
        <div className="mb-5 p-3 rounded-lg bg-[#f7f0d8] border border-[#e3d59a] flex gap-2 items-start">
          <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-ink leading-relaxed">{currentWeek.whyMatters}</p>
        </div>

        {/* Tasks */}
        <TaskList week={currentWeek} completed={state.completedTasks} onToggle={toggleTask} wateringNote={SOP.grow.wateringNote} canEdit={canEdit} />
      </Card>

      {/* Next up + Latest env */}
      <div className="grid md:grid-cols-2 gap-4">
        {nextWeek && (
          <Card>
            <div className="text-xs uppercase tracking-wider text-faded font-semibold mb-2">Next up</div>
            <div className="text-lg font-semibold text-ink mb-1">{nextWeek.label}: {nextWeek.stage}</div>
            <p className="text-sm text-faded leading-relaxed">{nextWeek.whyMatters}</p>
          </Card>
        )}
        <Card>
          <div className="text-xs uppercase tracking-wider text-faded font-semibold mb-2">Latest environment</div>
          {latestEnv ? (
            <div className="space-y-2 text-xs">
              <div className="bg-[#f7f0d8]/60 border border-[#e3d59a] rounded p-2">
                <div className="text-[10px] uppercase tracking-wide text-[#9a7d1a] font-semibold mb-1">☀️ Lights ON</div>
                <div className="grid grid-cols-3 gap-1 text-ink">
                  <div><span className="text-faded">T </span><span className="font-semibold">{latestEnv.tempOnAvg.toFixed(1)}°F</span></div>
                  <div><span className="text-faded">RH </span><span className="font-semibold">{latestEnv.rhOnAvg.toFixed(0)}%</span></div>
                  <div><span className="text-faded">VPD </span><span className="font-semibold">{latestEnv.vpdOnAvg.toFixed(2)}</span></div>
                </div>
              </div>
              <div className="bg-indigo-50/60 border border-indigo-100 rounded p-2">
                <div className="text-[10px] uppercase tracking-wide text-indigo-700 font-semibold mb-1">🌙 Lights OFF</div>
                <div className="grid grid-cols-3 gap-1 text-ink">
                  <div><span className="text-faded">T </span><span className="font-semibold">{latestEnv.tempOffAvg.toFixed(1)}°F</span></div>
                  <div><span className="text-faded">RH </span><span className="font-semibold">{latestEnv.rhOffAvg.toFixed(0)}%</span></div>
                  <div><span className="text-faded">VPD </span><span className="font-semibold">{latestEnv.vpdOffAvg.toFixed(2)}</span></div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-faded">No readings yet. Upload AC Infinity CSV in the Environment tab.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

// =============================================================
// SCHEDULE VIEW (Timeline of all weeks)
// =============================================================
function Schedule({ state, setState }) {
  const phaseColors = {
    clone: 'border-l-lime-300 bg-panel',
    veg: 'border-l-lime-500 bg-panel',
    flower: 'border-l-teal-500 bg-panel',
    harvest: 'border-l-purple-500 bg-panel',
    dry: 'border-l-amber-500 bg-[#f7f0d8]',
    cure: 'border-l-sky-500 bg-panel',
  };

  return (
    <div className="space-y-3">
      <Card className="bg-paper">
        <div className="text-xs uppercase tracking-wider text-faded font-semibold mb-1">Full Timeline</div>
        <h2 className="text-xl font-semibold text-ink">Pomelo Punch — {SOP.weeks.length} weeks total</h2>
        <p className="text-sm text-faded mt-1">Clone → 5 weeks veg → 8 weeks flower → 2 weeks dry → 8+ weeks cure. Click any week to make it current.</p>
      </Card>

      {SOP.weeks.map((week, idx) => {
        const isCurrent = week.id === state.currentWeekId;
        const isComplete = SOP.weeks.findIndex(w => w.id === state.currentWeekId) > idx;
        const colorClass = phaseColors[week.phase] || 'border-l-stone-400 bg-paper';

        return (
          <div
            key={week.id}
            onClick={() => setState(prev => ({ ...prev, currentWeekId: week.id }))}
            className={`border-l-4 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${colorClass} ${isCurrent ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-faded uppercase tracking-wider">Week {idx + 1}</span>
                  {isCurrent && <StatusPill status="info">Current</StatusPill>}
                  {isComplete && <StatusPill status="good">✓ Done</StatusPill>}
                </div>
                <h3 className="font-semibold text-ink">{week.label} — {week.stage}</h3>
                <p className="text-xs text-faded mt-1">{week.tempOn}°F on / {week.tempOff}°F off · {week.rhOn}%/{week.rhOff}% RH · Light {week.light}</p>
              </div>
              <ChevronRight size={20} className="text-faded flex-shrink-0 mt-1" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// =============================================================
// ENVIRONMENT VIEW (CSV upload + charts)
// =============================================================
function Environment({ state, setState }) {
  const [pasteValue, setPasteValue] = useState('');
  const [parseError, setParseError] = useState('');
  const [parseResult, setParseResult] = useState(null);

  // Parse the AC Infinity CSV
  const parseCSV = (text) => {
    setParseError('');
    setParseResult(null);
    const lines = text.split('\n');
    const readings = [];
    for (const line of lines) {
      const cleaned = line.replace(/"/g, '').trim();
      if (!cleaned || !cleaned.includes('/') || !cleaned.includes(':')) continue;
      const parts = cleaned.split(',');
      if (parts.length < 4) continue;
      const dateMatch = parts[0].match(/(\d+)\/(\d+)\/(\d+)\s+(\d+):(\d+)\s+(AM|PM)/i);
      if (!dateMatch) continue;
      const temp = parseFloat(parts[1]);
      const rh = parseFloat(parts[2]);
      const vpd = parseFloat(parts[3]);
      if (isNaN(temp) || isNaN(rh) || isNaN(vpd)) continue;
      const [, m, d, y, h, mi, ampm] = dateMatch;
      let hour = parseInt(h);
      if (ampm.toUpperCase() === 'PM' && hour !== 12) hour += 12;
      if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
      const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d), hour, parseInt(mi));
      const isLightsOn = hour < 12; // From CSV analysis: AM = lights on
      readings.push({ date, temp, rh, vpd, isLightsOn });
    }

    if (readings.length === 0) {
      setParseError('Could not parse any readings. Make sure this is the raw AC Infinity export.');
      return null;
    }

    // Compute averages
    const lightsOn = readings.filter(r => r.isLightsOn);
    const lightsOff = readings.filter(r => !r.isLightsOn);
    const avg = (arr, key) => arr.length ? arr.reduce((s, r) => s + r[key], 0) / arr.length : 0;

    const result = {
      readingCount: readings.length,
      dateRange: {
        start: readings[0].date.toLocaleDateString(),
        end: readings[readings.length - 1].date.toLocaleDateString(),
      },
      tempOnAvg: avg(lightsOn, 'temp'),
      tempOffAvg: avg(lightsOff, 'temp'),
      rhOnAvg: avg(lightsOn, 'rh'),
      rhOffAvg: avg(lightsOff, 'rh'),
      vpdOnAvg: avg(lightsOn, 'vpd'),
      vpdOffAvg: avg(lightsOff, 'vpd'),
    };

    setParseResult(result);
    return result;
  };

  const handleAttachToWeek = (weekId) => {
    if (!parseResult) return;
    const reading = {
      week: weekId,
      ...parseResult,
      uploadDate: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      envReadings: [...prev.envReadings, reading],
    }));
    setPasteValue('');
    setParseResult(null);
    setParseError('');
  };

  const currentWeek = SOP.weeks.find(w => w.id === state.currentWeekId) || SOP.weeks[0];

  // Compute status against targets
  const evaluateAgainstTarget = (value, targetRange) => {
    if (!targetRange) return 'neutral';
    const matches = targetRange.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
    if (!matches) return 'neutral';
    const min = parseFloat(matches[1]);
    const max = parseFloat(matches[2]);
    if (value >= min && value <= max) return 'good';
    if (value >= min - 3 && value <= max + 3) return 'warn';
    return 'bad';
  };

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="text-xl font-semibold text-ink mb-1">Environment Readings</h2>
        <p className="text-sm text-faded mb-4">
          Export your AC Infinity data weekly: in the AC Infinity app, go to your sensor → settings → export CSV. Paste it below.
        </p>

        <textarea
          value={pasteValue}
          onChange={e => setPasteValue(e.target.value)}
          placeholder='Paste your AC Infinity CSV export here. It looks like rows of "MM/DD/YYYY HH:MM AM/PM",temp,RH,VPD...'
          className="w-full h-32 px-3 py-2 border border-ink rounded-lg text-sm font-mono"
        />

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => parseCSV(pasteValue)}
            disabled={!pasteValue.trim()}
            className="px-4 py-2 bg-red text-white rounded-lg text-sm font-medium hover:bg-ink disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Upload size={14} /> Parse CSV
          </button>
          {pasteValue && (
            <button
              onClick={() => { setPasteValue(''); setParseResult(null); setParseError(''); }}
              className="px-4 py-2 border border-ink text-ink rounded-lg text-sm hover:bg-paper"
            >
              Clear
            </button>
          )}
        </div>

        {parseError && (
          <div className="mt-3 p-3 bg-[#fbeae9] border border-red rounded-lg text-sm text-red flex gap-2">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{parseError}</span>
          </div>
        )}

        {parseResult && (
          <div className="mt-4 p-4 bg-panel border border-hair rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-semibold text-ink">Parsed {parseResult.readingCount} readings</div>
                <div className="text-xs text-faded">{parseResult.dateRange.start} → {parseResult.dateRange.end}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div className="bg-paper rounded p-2 border border-hair">
                <div className="text-[10px] uppercase tracking-wide text-faded">Lights ON avg</div>
                <div className="font-semibold">{parseResult.tempOnAvg.toFixed(1)}°F · {parseResult.rhOnAvg.toFixed(0)}% RH · VPD {parseResult.vpdOnAvg.toFixed(2)}</div>
              </div>
              <div className="bg-paper rounded p-2 border border-hair">
                <div className="text-[10px] uppercase tracking-wide text-faded">Lights OFF avg</div>
                <div className="font-semibold">{parseResult.tempOffAvg.toFixed(1)}°F · {parseResult.rhOffAvg.toFixed(0)}% RH · VPD {parseResult.vpdOffAvg.toFixed(2)}</div>
              </div>
            </div>
            <div className="text-xs text-faded mb-2">Attach this reading to a week:</div>
            <select
              onChange={e => e.target.value && handleAttachToWeek(e.target.value)}
              defaultValue=""
              className="w-full px-3 py-2 border border-ink rounded-lg text-sm"
            >
              <option value="">Choose a week...</option>
              {SOP.weeks.map(w => (
                <option key={w.id} value={w.id}>{w.label} — {w.stage}</option>
              ))}
            </select>
          </div>
        )}
      </Card>

      {/* History */}
      {state.envReadings.length > 0 && (
        <Card>
          <h3 className="font-cond font-bold uppercase tracking-wide text-ink mb-3">Reading History — Week by Week</h3>
          <div className="space-y-3">
            {[...state.envReadings].reverse().map((r, i) => {
              const week = SOP.weeks.find(w => w.id === r.week);
              if (!week) return null;
              const tempOnStatus = evaluateAgainstTarget(r.tempOnAvg, week.tempOn);
              const tempOffStatus = evaluateAgainstTarget(r.tempOffAvg, week.tempOff);
              const rhOnStatus = evaluateAgainstTarget(r.rhOnAvg, week.rhOn);
              const rhOffStatus = evaluateAgainstTarget(r.rhOffAvg, week.rhOff);
              const vpdOnStatus = evaluateAgainstTarget(r.vpdOnAvg, week.vpdOn);
              const vpdOffStatus = evaluateAgainstTarget(r.vpdOffAvg, week.vpdOff);
              return (
                <div key={i} className="p-3 bg-paper rounded-lg border border-hair">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold text-sm">{week.label} — {week.stage}</div>
                    <div className="text-xs text-faded">{new Date(r.uploadDate).toLocaleDateString()}</div>
                  </div>
                  {/* Lights ON row */}
                  <div className="bg-[#f7f0d8]/50 border border-[#e3d59a] rounded p-2 mb-1.5">
                    <div className="text-[10px] uppercase tracking-wide text-[#9a7d1a] font-semibold mb-1">☀️ Lights ON</div>
                    <div className="grid grid-cols-3 gap-1.5 text-xs">
                      <div className="flex flex-col gap-0.5">
                        <StatusPill status={tempOnStatus}>{r.tempOnAvg.toFixed(1)}°F</StatusPill>
                        <span className="text-faded text-[10px]">target {week.tempOn}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <StatusPill status={rhOnStatus}>{r.rhOnAvg.toFixed(0)}%</StatusPill>
                        <span className="text-faded text-[10px]">target {week.rhOn}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <StatusPill status={vpdOnStatus}>VPD {r.vpdOnAvg.toFixed(2)}</StatusPill>
                        <span className="text-faded text-[10px]">target {week.vpdOn}</span>
                      </div>
                    </div>
                  </div>
                  {/* Lights OFF row */}
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded p-2">
                    <div className="text-[10px] uppercase tracking-wide text-indigo-700 font-semibold mb-1">🌙 Lights OFF</div>
                    <div className="grid grid-cols-3 gap-1.5 text-xs">
                      <div className="flex flex-col gap-0.5">
                        <StatusPill status={tempOffStatus}>{r.tempOffAvg.toFixed(1)}°F</StatusPill>
                        <span className="text-faded text-[10px]">target {week.tempOff}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <StatusPill status={rhOffStatus}>{r.rhOffAvg.toFixed(0)}%</StatusPill>
                        <span className="text-faded text-[10px]">target {week.rhOff}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <StatusPill status={vpdOffStatus}>VPD {r.vpdOffAvg.toFixed(2)}</StatusPill>
                        <span className="text-faded text-[10px]">target {week.vpdOff}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

// =============================================================
// JOURNAL VIEW (notes + photos per week)
// =============================================================
function Journal({ state, setState }) {
  const currentIdx = SOP.weeks.findIndex(w => w.id === state.currentWeekId);
  const currentWeek = SOP.weeks[currentIdx];
  const data = state.weeklyData[state.currentWeekId] || {};

  const updateField = (field, value) => {
    setState(prev => ({
      ...prev,
      weeklyData: {
        ...prev.weeklyData,
        [state.currentWeekId]: { ...(prev.weeklyData[state.currentWeekId] || {}), [field]: value },
      },
    }));
  };

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="text-xl font-semibold text-ink mb-1">Journal — {currentWeek.label}</h2>
        <p className="text-sm text-faded mb-5">Track observations, photos, and notes for {currentWeek.stage.toLowerCase()}.</p>

        {/* Week picker */}
        <div className="mb-5">
          <label className="text-xs uppercase tracking-wide text-faded font-semibold block mb-1">Editing week</label>
          <select
            value={state.currentWeekId}
            onChange={e => setState(prev => ({ ...prev, currentWeekId: e.target.value }))}
            className="w-full px-3 py-2 border border-ink rounded-lg text-sm"
          >
            {SOP.weeks.map(w => (
              <option key={w.id} value={w.id}>{w.label} — {w.stage}</option>
            ))}
          </select>
        </div>

        {/* Photo URL */}
        <div className="mb-5">
          <label className="text-xs uppercase tracking-wide text-faded font-semibold block mb-1 flex items-center gap-1">
            <Camera size={14} /> Photo URL (optional)
          </label>
          <input
            type="text"
            value={data.photoUrl || ''}
            onChange={e => updateField('photoUrl', e.target.value)}
            placeholder="Paste an image URL from your phone share-sheet, Google Photos, etc."
            className="w-full px-3 py-2 border border-ink rounded-lg text-sm"
          />
          {data.photoUrl && (
            <div className="mt-2 relative">
              <img
                src={data.photoUrl}
                alt={`Week ${currentWeek.label}`}
                className="rounded-lg border border-hair max-h-64 w-auto"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <button onClick={() => updateField('photoUrl', '')} className="absolute top-2 right-2 bg-paper/90 rounded-full p-1 border border-hair">
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Observations */}
        <div className="mb-5">
          <label className="text-xs uppercase tracking-wide text-faded font-semibold block mb-1">Observations</label>
          <textarea
            value={data.observations || ''}
            onChange={e => updateField('observations', e.target.value)}
            placeholder="What did the plants look like? Smell? Anything unusual? Health, color, structure, vigor..."
            className="w-full h-24 px-3 py-2 border border-ink rounded-lg text-sm"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs uppercase tracking-wide text-faded font-semibold block mb-1">Notes / changes from plan</label>
          <textarea
            value={data.notes || ''}
            onChange={e => updateField('notes', e.target.value)}
            placeholder="Anything you did differently from the SOP this week. Why. What you'd repeat or change next time."
            className="w-full h-24 px-3 py-2 border border-ink rounded-lg text-sm"
          />
        </div>
      </Card>

      {/* All week summaries */}
      <Card>
        <h3 className="font-cond font-bold uppercase tracking-wide text-ink mb-3">All entries</h3>
        <div className="space-y-2">
          {SOP.weeks.map(w => {
            const d = state.weeklyData[w.id];
            if (!d || (!d.observations && !d.notes && !d.photoUrl)) return null;
            return (
              <div key={w.id} className="p-3 bg-paper rounded-lg border border-hair">
                <div className="font-semibold text-sm mb-1">{w.label} — {w.stage}</div>
                {d.photoUrl && <div className="text-xs text-blue-600 mb-1">📷 Photo attached</div>}
                {d.observations && <div className="text-xs text-ink mb-1"><span className="font-medium">Saw:</span> {d.observations.slice(0, 150)}{d.observations.length > 150 ? '...' : ''}</div>}
                {d.notes && <div className="text-xs text-ink"><span className="font-medium">Notes:</span> {d.notes.slice(0, 150)}{d.notes.length > 150 ? '...' : ''}</div>}
              </div>
            );
          })}
          {SOP.weeks.every(w => {
            const d = state.weeklyData[w.id];
            return !d || (!d.observations && !d.notes && !d.photoUrl);
          }) && (
            <p className="text-sm text-faded">No journal entries yet. Add observations for the current week above.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

// =============================================================
// SETTINGS VIEW (start date, reset, export)
// =============================================================
function Settings({ state, setState }) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grow-tracker-pomelo-punch-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="text-xl font-semibold text-ink mb-4">Settings</h2>

        <div className="mb-5">
          <label className="text-xs uppercase tracking-wide text-faded font-semibold block mb-1">Grow start date</label>
          <input
            type="date"
            value={state.growStartDate || ''}
            onChange={e => setState(prev => ({ ...prev, growStartDate: e.target.value }))}
            className="px-3 py-2 border border-ink rounded-lg text-sm"
          />
          <p className="text-xs text-faded mt-1">Used for "days in" counter on dashboard.</p>
        </div>

        <div className="border-t border-hair pt-4 mb-5">
          <button
            onClick={exportData}
            className="px-4 py-2 border border-ink text-ink rounded-lg text-sm hover:bg-paper"
          >
            📥 Export all data (JSON)
          </button>
          <p className="text-xs text-faded mt-1">Download a backup of everything you've logged.</p>
        </div>

        <div className="border-t border-hair pt-4">
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 border border-red text-red rounded-lg text-sm hover:bg-[#fbeae9]"
            >
              🗑 Reset all data
            </button>
          ) : (
            <div className="bg-[#fbeae9] border border-red p-3 rounded-lg">
              <p className="text-sm text-red font-medium mb-2">Are you sure? This deletes all your logged data.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setState(defaultState); setShowResetConfirm(false); }}
                  className="px-3 py-1.5 bg-red-600 text-white rounded text-sm"
                >
                  Yes, reset
                </button>
                <button onClick={() => setShowResetConfirm(false)} className="px-3 py-1.5 border border-ink rounded text-sm">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="bg-paper">
        <div className="text-xs uppercase tracking-wide text-faded font-semibold mb-2">About this grow</div>
        <div className="text-sm space-y-1 text-ink">
          <div><span className="text-faded">Strain:</span> {SOP.grow.strain}</div>
          <div><span className="text-faded">Breeder:</span> {SOP.grow.breeder}</div>
          <div><span className="text-faded">Plants:</span> {SOP.grow.plantCount}</div>
          <div><span className="text-faded">Container:</span> {SOP.grow.container}</div>
          <div><span className="text-faded">Soil:</span> {SOP.grow.soil}</div>
          <div><span className="text-faded">Light:</span> {SOP.grow.light}</div>
        </div>
        <p className="text-xs text-faded mt-3 leading-relaxed">{SOP.grow.notes}</p>
      </Card>
    </div>
  );
}

// =============================================================
// HISTORY VIEW (past grows for comparison)
// =============================================================
function History() {
  return (
    <div className="space-y-5">
      <Card className="bg-paper">
        <h2 className="text-xl font-semibold text-ink mb-1">Past Grows</h2>
        <p className="text-sm text-faded">Reference baselines from previous runs. Use these to compare what's different this time.</p>
      </Card>

      {/* Side-by-side summary */}
      <Card>
        <h3 className="font-cond font-bold uppercase tracking-wide text-ink mb-3">Yield Comparison</h3>
        <div className="grid grid-cols-2 gap-3">
          {HISTORICAL_GROWS.map(g => (
            <div key={g.id} className="p-3 bg-paper rounded-lg border border-hair">
              <div className="text-xs uppercase tracking-wide text-faded mb-1">{g.strain}</div>
              <div className="text-2xl font-semibold text-ink">{g.yieldGrams}g</div>
              <div className="text-xs text-faded">{g.yieldOz} oz · chopped {new Date(g.chopDate).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 bg-[#f7f0d8] border border-[#e3d59a] rounded-lg text-sm text-ink">
          <span className="font-medium">2x yield gap, same tent, same conditions.</span> Sour Irene out-yielded Peaches almost 2:1. Most of the gap traces to Peaches' soil going hydrophobic mid-grow.
        </div>
      </Card>

      {/* Yield Benchmarks */}
      <Card>
        <h3 className="font-cond font-bold uppercase tracking-wide text-ink mb-1">Where You Stand</h3>
        <p className="text-xs text-faded mb-3">2x4 tent, ~450W Spider Farmer SE4500, 2 plants</p>

        {/* Per-plant benchmark scale */}
        <div className="mb-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-faded mb-2">Yield per plant</div>
          <div className="space-y-1.5">
            {[
              { tier: 'Beginner / problem grow', range: '< 50g', status: 'neutral', isYou: false },
              { tier: 'Average home grow', range: '60-90g', status: 'neutral', isYou: false },
              { tier: 'Skilled home grow', range: '100-170g', status: 'good', isYou: true, youLabel: 'Sour Irene 147g' },
              { tier: 'Dialed-in expert', range: '180-250g', status: 'good', isYou: false },
              { tier: 'Theoretical max (1 plant)', range: '~300g', status: 'neutral', isYou: false },
            ].map((t, i) => (
              <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm ${t.isYou ? 'bg-panel border-ink ring-1 ring-emerald-300' : 'bg-paper border-hair'}`}>
                <div className="flex items-center gap-2">
                  {t.isYou && <span className="text-red">→</span>}
                  <span className={t.isYou ? 'font-semibold text-ink' : 'text-ink'}>{t.tier}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={t.isYou ? 'font-semibold text-red' : 'text-faded'}>{t.range}</span>
                  {t.isYou && <StatusPill status="good">You</StatusPill>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-faded">
            Peaches at 75g sat in the "average" band — but only because soil went hydrophobic. The plant was capable of much more.
          </div>
        </div>

        {/* Grams per watt */}
        <div className="border-t border-hair pt-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-faded mb-2">Grams per watt (industry standard)</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-paper rounded">
              <span className="text-sm text-ink">Skilled</span>
              <span className="text-sm font-medium text-ink">1.0 g/W</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-paper rounded">
              <span className="text-sm text-ink">Excellent (craft-tier)</span>
              <span className="text-sm font-medium text-ink">1.5+ g/W</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#f7f0d8] border border-[#e3d59a] rounded">
              <div>
                <div className="text-sm font-semibold text-ink">Your last grow (whole tent)</div>
                <div className="text-xs text-faded">222g ÷ 450W</div>
              </div>
              <StatusPill status="warn">0.49 g/W</StatusPill>
            </div>
          </div>
          <p className="text-xs text-faded mt-3 leading-relaxed">
            Sour Irene wasn't capped by genetics — she was capped by environment. 70% light max, no cold finish, broken fan during stretch, and likely the same P/K deficit. With SOP changes she'd be capable of 200g+ alone.
          </p>
        </div>

        {/* Pomelo Punch targets */}
        <div className="border-t border-hair pt-4 mt-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-red mb-2">🎯 Pomelo Punch Targets</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2.5 bg-panel border border-hair rounded">
              <div>
                <div className="text-sm font-semibold text-ink">Conservative</div>
                <div className="text-xs text-faded">175-200g per plant · ~0.85 g/W</div>
              </div>
              <div className="text-lg font-semibold text-red">350-400g</div>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-panel border border-hair rounded">
              <div>
                <div className="text-sm font-semibold text-ink">Realistic stretch</div>
                <div className="text-xs text-faded">200-250g per plant · 1.0+ g/W</div>
              </div>
              <div className="text-lg font-semibold text-red">400-500g</div>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-panel border border-ink rounded">
              <div>
                <div className="text-sm font-semibold text-ink">If everything dials in</div>
                <div className="text-xs text-faded">Craft-tier territory</div>
              </div>
              <div className="text-lg font-semibold text-ink">500g+</div>
            </div>
          </div>
          <p className="text-xs text-faded mt-3 leading-relaxed">
            Pomelo Punch produces dense, sticky, trichome-heavy buds (indica-leaning, Papaya lineage). Good yielder with strong bag appeal. Yield and quality move together when environment is the bottleneck — both should improve.
          </p>
        </div>
      </Card>

      {/* Detailed cards */}
      {HISTORICAL_GROWS.map(g => (
        <Card key={g.id}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-ink">{g.strain}</h3>
              <p className="text-xs text-faded">Chopped {new Date(g.chopDate).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-ink">{g.yieldGrams}g</div>
              <div className="text-xs text-faded">{g.yieldOz} oz</div>
            </div>
          </div>

          {(g.aBudsGrams || g.smallMedGrams) && (
            <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
              {g.aBudsGrams && <div className="bg-panel border border-hair rounded p-2"><div className="text-faded">Tops / "A" buds</div><div className="font-semibold">{g.aBudsGrams}g</div></div>}
              {g.smallMedGrams && <div className="bg-paper border border-hair rounded p-2"><div className="text-faded">Small / mediums</div><div className="font-semibold">{g.smallMedGrams}g</div></div>}
            </div>
          )}

          <div className="mb-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-faded mb-1.5">Smoke Report</div>
            <div className="space-y-1 text-sm">
              <div><span className="text-faded">Flavor:</span> {g.smokeReport.flavor}</div>
              <div><span className="text-faded">Smoothness:</span> {g.smokeReport.smoothness}</div>
              <div><span className="text-faded">Ash:</span> {g.smokeReport.ash}</div>
              <div><span className="text-faded">Resin:</span> {g.smokeReport.resin}</div>
              <div><span className="text-faded">Potency:</span> {g.smokeReport.potency}</div>
            </div>
            <div className={`mt-2 p-2 rounded text-xs ${g.smokeReport.verdict.startsWith('✓') ? 'bg-panel text-ink border border-hair' : 'bg-[#fbeae9] text-ink border border-red'}`}>
              {g.smokeReport.verdict}
            </div>
          </div>

          <div className="mb-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-faded mb-1.5">Grow Setup</div>
            <div className="grid grid-cols-2 gap-1 text-xs text-ink">
              <div><span className="text-faded">Light schedule:</span> {g.grow.lightSchedule}</div>
              <div><span className="text-faded">Max light:</span> {g.grow.maxLightPct}</div>
              <div><span className="text-faded">Cold finish:</span> {g.grow.coldFinish}</div>
              <div><span className="text-faded">Dry:</span> {g.grow.dryMethod}</div>
              <div className="col-span-2"><span className="text-faded">Cure:</span> {g.grow.cureMethod}</div>
            </div>
          </div>

          {g.grow.majorIssues && g.grow.majorIssues.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-red mb-1.5">⚠️ Issues That Hurt Quality</div>
              <ul className="space-y-1 text-xs text-ink">
                {g.grow.majorIssues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-red mt-0.5">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      ))}

      {/* What we're doing differently */}
      <Card className="bg-panel border-hair">
        <h3 className="font-cond font-bold uppercase tracking-wide text-ink mb-2">📋 What's Different for Pomelo Punch</h3>
        <ul className="space-y-1.5 text-sm text-ink">
          <li>✓ Backup exhaust fan in the box (single-point failure fix)</li>
          <li>✓ Daily soil moisture check + Quillaja every water (hydrophobic prevention)</li>
          <li>✓ Cold-night protocol weeks 6-9 with portable AC architecture</li>
          <li>✓ Light pushed to 90-100% during resin window (was 70%)</li>
          <li>✓ Sealed cure with disciplined burping (not lid-off for weeks)</li>
          <li>✓ Bokashi K Humate at F3-F4 addresses last run\'s P/K deficit</li>
          <li>✓ Chop 80-90% cloudy, 10-20% amber — heat-stable caryophyllene strain</li>
        </ul>
      </Card>
    </div>
  );
}

// =============================================================
// MAIN APP
// =============================================================
function LoginModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true); setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setErr(error.message);
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-paper border-2 border-ink max-w-sm w-full p-5" onClick={e => e.stopPropagation()}>
        <h3 className="font-cond font-bold uppercase tracking-wide text-lg mb-3 pb-2 border-b border-ink">Sign in to edit</h3>
        <input
          type="email" placeholder="email" value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-2 px-3 py-2 border border-hair bg-paper text-ink text-sm font-serif"
        />
        <input
          type="password" placeholder="password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          className="w-full mb-3 px-3 py-2 border border-hair bg-paper text-ink text-sm font-serif"
        />
        {err && <p className="text-red text-xs mb-2">{err}</p>}
        <div className="flex gap-2">
          <button onClick={submit} disabled={busy} className="flex-1 bg-ink text-paper font-cond uppercase tracking-wider text-xs py-2.5">
            {busy ? '…' : 'Sign in'}
          </button>
          <button onClick={onClose} className="px-4 border border-ink font-cond uppercase tracking-wider text-xs">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// =============================================================
function DellisSplash() {
  return (
    <div className="fixed inset-0 z-[100] bg-void flex flex-col items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-[420px] px-6 flex flex-col items-center">
        <div className="relative w-full">
          <img
            src="dellis.jpg"
            alt="DJ Dellis — Dave Ellis"
            className="w-full block animate-[fadein_0.6s_ease-out]"
            style={{ boxShadow: 'inset 0 0 120px 40px #000' }}
          />
          <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 100px 30px #0a0a14' }} />
        </div>
        <div className="mt-5 text-center">
          <div className="font-cond font-bold uppercase tracking-[0.04em] text-2xl text-yellow leading-none">
            Pomelo Punch
          </div>
          <div className="font-cond uppercase tracking-[0.25em] text-[10px] text-faded mt-2">
            A UHH DIRT Grow Log
          </div>
        </div>
      </div>
      <style>{`@keyframes fadein{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
}

// =============================================================
export default function GrowTracker() {
  const [view, setView] = useState('dashboard');
  const [state, setState] = useState(defaultState);
  const [loaded, setLoaded] = useState(false);
  const [session, setSession] = useState(null);      // null = public/read-only; set = editor
  const [saving, setSaving] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [splash, setSplash] = useState(true);

  // In LOCAL mode (Supabase not configured yet) editing is open on this device.
  // In CLOUD mode, only a signed-in session can edit.
  const canEdit = isCloud ? !!session : true;
  const LS_KEY = 'uhhdirt-grow:' + GROW_ID;

  // Splash on every open, ~1.6s
  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1600);
    return () => clearTimeout(t);
  }, []);

  // Load grow state (cloud if configured, else localStorage) + watch auth
  useEffect(() => {
    let active = true;
    (async () => {
      if (isCloud) {
        try {
          const { data } = await supabase
            .from('grow_state')
            .select('state')
            .eq('id', GROW_ID)
            .maybeSingle();
          // Merge with defaults so an empty/partial row can't break the UI
          if (active && data && data.state && Object.keys(data.state).length > 0) {
            setState({ ...defaultState, ...data.state });
          }
        } catch (err) {
          console.error('Load failed:', err);
        }
      } else {
        try {
          const raw = localStorage.getItem(LS_KEY);
          if (active && raw) setState(JSON.parse(raw));
        } catch (err) { /* no local data yet */ }
      }
      if (active) setLoaded(true);
    })();

    if (isCloud) {
      supabase.auth.getSession().then(({ data }) => {
        if (active) setSession(data.session);
      });
      const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
        setSession(s);
      });
      return () => { active = false; sub.subscription.unsubscribe(); };
    }
    return () => { active = false; };
  }, []);

  // Persist — cloud when configured + signed in, else localStorage.
  const persist = async (nextState) => {
    if (!canEdit) return;
    if (isCloud) {
      setSaving(true);
      try {
        const { error } = await supabase
          .from('grow_state')
          .upsert({ id: GROW_ID, state: nextState, updated_at: new Date().toISOString() });
        if (error) console.error('Save failed:', error);
      } catch (err) {
        console.error('Save failed:', err);
      }
      setSaving(false);
    } else {
      try { localStorage.setItem(LS_KEY, JSON.stringify(nextState)); } catch (err) { /* ignore */ }
    }
  };

  // Wrap setState so every editor change also pushes to the cloud.
  const updateState = (updater) => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      persist(next);
      return next;
    });
  };

  if (splash) {
    return <DellisSplash />;
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="font-cond uppercase tracking-[0.2em] text-yellow text-sm animate-pulse">Loading the grow…</div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Today' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'environment', label: 'Env' },
    { id: 'journal', label: 'Journal' },
    { id: 'history', label: 'History' },
    { id: 'settings', label: 'Set' },
  ];

  return (
    <div className="min-h-screen bg-cream font-serif text-ink">
      <div className="max-w-3xl mx-auto pb-24">
        {/* Riot masthead */}
        <div className="relative overflow-hidden border-b-4 border-void px-5 pt-5 pb-6"
             style={{ background: 'linear-gradient(135deg,#1a8fff 0%,#0b67c2 60%,#063e7a 100%)' }}>
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: 'repeating-linear-gradient(115deg,transparent 0 22px,rgba(255,255,255,.06) 22px 44px)' }} />
          <div className="relative flex items-start justify-between">
            <div>
              <span className="inline-block bg-mag text-white font-cond font-bold text-[10px] tracking-[0.18em] uppercase px-2 py-0.5 border-2 border-void mb-2"
                    style={{ transform: 'skewX(-7deg)' }}>
                Pimp Palace West
              </span>
              <h1 className="font-cond font-bold uppercase text-4xl leading-[0.88] text-yellow"
                  style={{ transform: 'skewX(-7deg)', textShadow: '3px 3px 0 #000, 5px 5px 0 #ff2e85' }}>
                UHH DIRT<br/>Grow
              </h1>
            </div>
            <div className="relative z-[2] text-right">
              {!isCloud ? (
                <span className="bg-yellow text-void font-cond font-bold text-[10px] uppercase px-2 py-1 border-2 border-void inline-block"
                      style={{ transform: 'rotate(4deg)', boxShadow: '2px 2px 0 #000' }}>
                  local
                </span>
              ) : canEdit ? (
                <button onClick={() => supabase.auth.signOut()}
                        className="bg-yellow text-void font-cond font-bold text-[10px] uppercase px-2 py-1 border-2 border-void"
                        style={{ transform: 'rotate(4deg)', boxShadow: '2px 2px 0 #000' }}>
                  {saving ? 'saving…' : 'editing · out'}
                </button>
              ) : (
                <button onClick={() => setShowLogin(true)}
                        className="bg-cream text-void font-cond font-bold text-[10px] uppercase px-2 py-1 border-2 border-void"
                        style={{ transform: 'rotate(4deg)', boxShadow: '2px 2px 0 #000' }}>
                  sign in
                </button>
              )}
            </div>
          </div>
        </div>

        {isCloud && !canEdit && (
          <div className="bg-void text-faded font-cond uppercase tracking-wider text-[10px] px-5 py-1.5 text-center">
            Viewing Paul's grow log — read only
          </div>
        )}

        {showLogin && isCloud && !canEdit && (
          <LoginModal onClose={() => setShowLogin(false)} />
        )}

        <div className="px-4 pt-4">
          {/* Content */}
          {view === 'dashboard' && <Dashboard state={state} setState={updateState} canEdit={canEdit} />}
          {view === 'schedule' && <Schedule state={state} setState={updateState} canEdit={canEdit} />}
          {view === 'environment' && <Environment state={state} setState={updateState} canEdit={canEdit} />}
          {view === 'journal' && <Journal state={state} setState={updateState} canEdit={canEdit} />}
          {view === 'history' && <History />}
          {view === 'settings' && <Settings state={state} setState={updateState} canEdit={canEdit} />}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-void border-t-4 border-void">
        <div className="max-w-3xl mx-auto px-1">
          <div className="flex justify-between">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`flex-1 flex flex-col items-center py-3 font-cond font-bold uppercase tracking-wider text-[11px] transition-colors ${view === tab.id ? 'text-yellow' : 'text-faded hover:text-cream'}`}
              >
                {view === tab.id && <span className="block w-4 h-[3px] bg-mag mb-1.5" />}
                {view !== tab.id && <span className="block w-4 h-[3px] bg-transparent mb-1.5" />}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
