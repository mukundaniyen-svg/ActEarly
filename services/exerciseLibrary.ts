import { Exercise } from '../types';

export const EXERCISE_LIBRARY: Exercise[] = [
  // --- EYES ---
  {
    name: "20-20-20 Reset",
    durationSeconds: 60,
    instructions: [
      "Sit comfortably and look away from your screen.",
      "Focus on an object at least 20 feet away for 20 seconds.",
      "Blink slowly and fully for the remaining time."
    ],
    benefits: "Relaxes the eye focusing muscles.",
    prevention: "Mitigates Computer Vision Syndrome (CVS) and accommodative spasms from prolonged near-work.",
    category: "Eyes",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },
  {
    name: "Ocular Palming",
    durationSeconds: 60,
    instructions: [
      "Rub your hands together to warm your palms.",
      "Gently place palms over closed eyes without pressing.",
      "Breathe slowly and relax in the darkness."
    ],
    benefits: "Calms the eyes and facial muscles.",
    prevention: "Reduces visual fatigue and sensory overstimulation affecting the optic nerve.",
    category: "Eyes",
    posture: "Seated",
    environmentCompatibility: "Both"
  },
  {
    name: "Near–Far Focus Shift",
    durationSeconds: 60,
    instructions: [
      "Hold your thumb about 6 inches from your face.",
      "Focus on your thumb for 5 seconds.",
      "Shift focus to something far away and repeat."
    ],
    benefits: "Improves eye muscle coordination.",
    prevention: "Enhances ciliary muscle flexibility to prevent accommodative lag and focus fatigue.",
    category: "Eyes",
    posture: "Seated",
    environmentCompatibility: "Both"
  },

  // --- NECK ---
  {
    name: "Chin Tucks",
    durationSeconds: 60,
    instructions: [
      "Sit or stand tall with eyes facing forward.",
      "Gently pull your chin straight back without tilting your head.",
      "Hold for 3 seconds, relax, and repeat."
    ],
    benefits: "Activates deep neck stabilizing muscles.",
    prevention: "Corrects 'Forward Head Posture' to prevent cervical disc compression and upper crossed syndrome.",
    category: "Neck",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },
  {
    name: "Levator Scapulae Stretch",
    durationSeconds: 60,
    instructions: [
      "Sit on one hand to keep the shoulder relaxed.",
      "Turn your head slightly and look down toward your armpit.",
      "Gently assist with the opposite hand. Switch sides after 30 seconds."
    ],
    benefits: "Releases tension in the upper neck and shoulder area.",
    prevention: "Relieves mechanical neck pain and prevents tension-type headaches (TTH).",
    category: "Neck",
    posture: "Seated",
    environmentCompatibility: "Both"
  },
  {
    name: "Neck Side Glides",
    durationSeconds: 60,
    instructions: [
      "Sit upright and look straight ahead.",
      "Slowly slide your head toward one shoulder without tilting.",
      "Return to center and alternate sides."
    ],
    benefits: "Improves neck joint mobility.",
    prevention: "Promotes cervical facet joint lubrication and prevents segmental stiffness.",
    category: "Neck",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },

  // --- SHOULDERS ---
  {
    name: "Scapular Squeezes",
    durationSeconds: 60,
    instructions: [
      "Sit or stand tall with arms relaxed by your sides.",
      "Squeeze your shoulder blades gently together and down.",
      "Hold for 5 seconds and repeat."
    ],
    benefits: "Activates upper-back postural muscles.",
    prevention: "Counteracts scapular dyskinesis and reduces the risk of shoulder impingement syndrome.",
    category: "Shoulders",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },
  {
    name: "Desk Wall Slides",
    durationSeconds: 60,
    instructions: [
      "Stand with your back against a wall or sit very upright.",
      "Form a ‘W’ with your arms against the wall.",
      "Slowly slide arms upward into a ‘Y’ and return."
    ],
    benefits: "Improves shoulder mobility and posture.",
    prevention: "Enhances thoracic extension and prevents adhesive capsulitis (frozen shoulder) symptoms.",
    category: "Shoulders",
    posture: "Standing",
    environmentCompatibility: "Home"
  },
  {
    name: "Arm Circles Reset",
    durationSeconds: 60,
    instructions: [
      "Extend your arms out to the sides.",
      "Make small forward circles for 30 seconds.",
      "Reverse direction for the remaining time."
    ],
    benefits: "Lubricates the shoulder joints.",
    prevention: "Maintains glenohumeral joint range of motion and prevents bursitis.",
    category: "Shoulders",
    posture: "Standing",
    environmentCompatibility: "Both"
  },

  // --- WRISTS ---
  {
    name: "Prayer Stretch",
    durationSeconds: 60,
    instructions: [
      "Place palms together in front of your chest.",
      "Lower hands slowly toward your waist while keeping palms together.",
      "Hold briefly, relax, and repeat."
    ],
    benefits: "Stretches the wrist and forearm muscles.",
    prevention: "Prevents Carpal Tunnel Syndrome by relieving pressure on the median nerve.",
    category: "Wrists",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },
  {
    name: "Wrist Nerve Glides",
    durationSeconds: 60,
    instructions: [
      "Extend one arm forward with palm facing up.",
      "Slowly bend the wrist down and then back up.",
      "Move gently and switch arms after 30 seconds."
    ],
    benefits: "Encourages smooth nerve movement.",
    prevention: "Reduces neural tension and prevents repetitive strain injuries (RSI) in the forearm.",
    category: "Wrists",
    posture: "Seated",
    environmentCompatibility: "Both"
  },
  {
    name: "Wrist Circles",
    durationSeconds: 60,
    instructions: [
      "Extend arms forward with relaxed fists.",
      "Rotate wrists slowly in one direction.",
      "Switch direction after 30 seconds."
    ],
    benefits: "Improves wrist joint circulation.",
    prevention: "Minimizes synovial fluid stagnation to prevent wrist tenosynovitis.",
    category: "Wrists",
    posture: "Seated",
    environmentCompatibility: "Both"
  },

  // --- BACK ---
  {
    name: "Seated Spinal Twist",
    durationSeconds: 60,
    instructions: [
      "Sit upright and place one hand on the chair back.",
      "Gently twist your torso while keeping hips forward.",
      "Hold briefly and switch sides."
    ],
    benefits: "Improves spinal mobility.",
    prevention: "Promotes intervertebral disc hydration and prevents rotational stiffness in the thoracic spine.",
    category: "Back",
    posture: "Seated",
    environmentCompatibility: "Both"
  },
  {
    name: "Seated Cat–Cow",
    durationSeconds: 60,
    instructions: [
      "Sit tall with hands on knees.",
      "Inhale and gently arch your back.",
      "Exhale and round your spine. Move with your breath."
    ],
    benefits: "Moves the spine through a healthy range.",
    prevention: "Helps prevent lumbar disc bulging and eases generalized myofascial back pain.",
    category: "Back",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },
  {
    name: "Standing Back Extension",
    durationSeconds: 60,
    instructions: [
      "Stand with hands on your lower back.",
      "Gently lean backward while keeping knees straight.",
      "Hold briefly and repeat slowly."
    ],
    benefits: "Counters prolonged forward bending.",
    prevention: "Neutralizes lumbar flexion pressure to reduce the risk of disc herniation and sciatica.",
    category: "Back",
    posture: "Standing",
    environmentCompatibility: "Home"
  },

  // --- HIPS ---
  {
    name: "Seated Figure Four",
    durationSeconds: 60,
    instructions: [
      "Cross one ankle over the opposite knee.",
      "Sit tall and gently lean forward.",
      "Switch sides after 30 seconds."
    ],
    benefits: "Stretches hip and glute muscles.",
    prevention: "Prevents Piriformis Syndrome and associated pseudo-sciatica symptoms.",
    category: "Hips",
    posture: "Seated",
    environmentCompatibility: "Both"
  },
  {
    name: "Hip Flexor Release",
    durationSeconds: 60,
    instructions: [
      "Stand and step one foot slightly back.",
      "Tuck your hips and squeeze the back-side glute.",
      "Hold briefly and switch sides."
    ],
    benefits: "Lengthens muscles shortened by sitting.",
    prevention: "Reduces anterior pelvic tilt and prevents compensatory lumbar lordosis.",
    category: "Hips",
    posture: "Standing",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },
  {
    name: "Marching in Place",
    durationSeconds: 60,
    instructions: [
      "Stand tall with arms relaxed.",
      "Lift one knee toward your chest.",
      "Lower and alternate legs at a steady pace."
    ],
    benefits: "Activates hips and improves circulation.",
    prevention: "Improves lymphatic drainage and prevents hip capsule tightness from prolonged inactivity.",
    category: "Hips",
    posture: "Standing",
    environmentCompatibility: "Home"
  },

  // --- KNEES ---
  {
    name: "Seated Leg Extensions",
    durationSeconds: 60,
    instructions: [
      "Sit upright with feet flat on the floor.",
      "Straighten one leg and hold briefly.",
      "Lower slowly and alternate legs."
    ],
    benefits: "Strengthens thigh muscles.",
    prevention: "Supports patellofemoral tracking to prevent 'Runner’s Knee' symptoms in sedentary workers.",
    category: "Knees",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },
  {
    name: "Sit-to-Stand",
    durationSeconds: 60,
    instructions: [
      "Sit near the edge of your chair.",
      "Stand up without using your hands.",
      "Sit back down slowly and repeat."
    ],
    benefits: "Strengthens legs and hips.",
    prevention: "Preserves functional lower-chain mobility and prevents quadriceps atrophy.",
    category: "Knees",
    posture: "Standing",
    environmentCompatibility: "Both"
  },

  // --- ANKLES ---
  {
    name: "Ankle Alphabet",
    durationSeconds: 60,
    instructions: [
      "Lift one foot off the floor.",
      "Trace the letters of the alphabet with your toes.",
      "Switch feet halfway through."
    ],
    benefits: "Moves the ankle through multiple directions.",
    prevention: "Reduces the risk of peripheral edema and maintains talocrural joint mobility.",
    category: "Ankles",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },
  {
    name: "Calf Pumps",
    durationSeconds: 60,
    instructions: [
      "Keep toes on the floor and lift your heels.",
      "Lower heels and lift toes upward.",
      "Alternate at a steady pace."
    ],
    benefits: "Activates lower leg muscles.",
    prevention: "Promotes venous return to prevent Deep Vein Thrombosis (DVT) and varicose veins.",
    category: "Ankles",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },

  // --- ELBOWS ---
  {
    name: "Ulnar Nerve Glide",
    durationSeconds: 60,
    instructions: [
      "Make an ‘OK’ sign with your fingers.",
      "Rotate the hand and bring it gently toward your face.",
      "Move slowly and switch sides halfway."
    ],
    benefits: "Encourages smooth elbow and nerve movement.",
    prevention: "Prevents Cubital Tunnel Syndrome and ulnar nerve entrapment at the elbow.",
    category: "Elbows",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  }
];