
import { Exercise } from '../types';

export const EXERCISE_LIBRARY: Exercise[] = [
  // --- EYES ---
  {
    name: "20-20-20 Reset",
    durationSeconds: 60,
    instructions: ["Find an object at least 20 feet away.", "Focus on it intensely for 20 seconds.", "Blink rapidly for the remaining time to lubricate eyes."],
    benefits: "Resets the ciliary muscle of the eye.",
    prevention: "Reduces digital eye strain and prevents myopia progression.",
    category: "Eyes",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },
  {
    name: "Ocular Palming",
    durationSeconds: 60,
    instructions: ["Rub your hands together to create heat.", "Gently cup your palms over closed eyes.", "Breathe deeply and enjoy the total darkness."],
    benefits: "Soothes the optic nerve and relaxes facial muscles.",
    prevention: "Prevents stress-induced eye twitching and tension headaches.",
    category: "Eyes",
    posture: "Seated",
    environmentCompatibility: "Both"
  },

  // --- NECK ---
  {
    name: "Cervical Chin Tucks",
    durationSeconds: 60,
    instructions: ["Sit tall and look straight ahead.", "Gently pull your chin straight back like making a double-chin.", "Hold for 3 seconds, release and repeat."],
    benefits: "Strengthens deep neck flexors.",
    prevention: "Prevents 'Tech Neck' and upper cervical disc compression.",
    category: "Neck",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },
  {
    name: "Levator Scapulae Stretch",
    durationSeconds: 60,
    instructions: ["Sit on your right hand to anchor the shoulder.", "Turn head 45 degrees left and look down at your armpit.", "Gently assist with your left hand for 30s, then switch sides."],
    benefits: "Releases the muscle that shrugs your shoulders under stress.",
    prevention: "Prevents chronic neck stiffness and tension headaches.",
    category: "Neck",
    posture: "Seated",
    environmentCompatibility: "Both"
  },

  // --- SHOULDERS ---
  {
    name: "Scapular Squeezes",
    durationSeconds: 60,
    instructions: ["Imagine a pencil between your shoulder blades.", "Squeeze the blades together and down away from ears.", "Hold for 5 seconds and repeat."],
    benefits: "Activates the rhomboids and mid-trapezius.",
    prevention: "Corrects rounded shoulders and prevents impingement syndrome.",
    category: "Shoulders",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },
  {
    name: "Desk Wall Slides",
    durationSeconds: 60,
    instructions: ["Stand with back against a wall or sit tall.", "Form a 'W' shape with arms, elbows and wrists against the wall.", "Slowly slide arms up into a 'Y' and back down."],
    benefits: "Improves shoulder mobility and thoracic extension.",
    prevention: "Prevents rotator cuff tears and frozen shoulder.",
    category: "Shoulders",
    posture: "Standing",
    environmentCompatibility: "Home"
  },

  // --- WRISTS ---
  {
    name: "The Prayer Stretch",
    durationSeconds: 60,
    instructions: ["Place palms together in front of your chest.", "Slowly lower hands toward your waist while keeping palms flat.", "Hold for 10s, release, and repeat."],
    benefits: "Stretches the wrist flexors.",
    prevention: "Prevents Carpal Tunnel Syndrome and tendonitis.",
    category: "Wrists",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },
  {
    name: "Nerve Gliding",
    durationSeconds: 60,
    instructions: ["Extend arm forward, palm up.", "Slowly tilt hand down toward floor, then back toward shoulder.", "Repeat with gentle, fluid motions. Switch arms at 30s."],
    benefits: "Flushes the median nerve through the carpal tunnel.",
    prevention: "Reduces numbness and tingling in fingers.",
    category: "Wrists",
    posture: "Seated",
    environmentCompatibility: "Both"
  },

  // --- BACK ---
  {
    name: "Seated Spinal Twist",
    durationSeconds: 60,
    instructions: ["Sit sideways on your chair.", "Use the chair back to gently twist your torso.", "Hold for 30s per side. Breathe into the twist."],
    benefits: "Mobilizes the thoracic spine and improves digestion.",
    prevention: "Prevents lower back stiffness and disc degeneration.",
    category: "Back",
    posture: "Seated",
    environmentCompatibility: "Both"
  },
  {
    name: "Seated Cat-Cow",
    durationSeconds: 60,
    instructions: ["Place hands on knees.", "Inhale: Arch back and look up (Cow).", "Exhale: Round spine and tuck chin (Cat). Flow with breath."],
    benefits: "Moves every vertebrae in the spine.",
    prevention: "Maintains spinal fluid flow and prevents postural slump.",
    category: "Back",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },

  // --- HIPS ---
  {
    name: "Seated Figure Four",
    durationSeconds: 60,
    instructions: ["Cross right ankle over left knee.", "Flex the right foot and sit very tall.", "Gently lean forward with a flat back. 30s per side."],
    benefits: "Stretches the piriformis and glutes.",
    prevention: "Prevents sciatica and lower back referred pain.",
    category: "Hips",
    posture: "Seated",
    environmentCompatibility: "Both"
  },
  {
    name: "Office Hip Flexor Release",
    durationSeconds: 60,
    instructions: ["Stand up and take a small step back with one foot.", "Tuck your tailbone and squeeze the glute of the back leg.", "Feel a gentle stretch in the front of the hip. 30s per side."],
    benefits: "Lengthens the psoas muscle.",
    prevention: "Corrects pelvic tilt caused by hours of sitting.",
    category: "Hips",
    posture: "Standing",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },

  // --- KNEES ---
  {
    name: "Seated Leg Extensions",
    durationSeconds: 60,
    instructions: ["Sit back in your chair.", "Straighten one leg and flex your toes toward you.", "Hold for 3s, lower slowly. Switch legs every 5 reps."],
    benefits: "Strengthens the VMO (inner quad) for patellar tracking.",
    prevention: "Prevents 'Runner's Knee' and patellofemoral pain.",
    category: "Knees",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },

  // --- ANKLES ---
  {
    name: "Ankle Alphabet",
    durationSeconds: 60,
    instructions: ["Lift one foot off the floor.", "Use your big toe to draw the letters A-Z in the air.", "Switch feet after the letter M."],
    benefits: "Mobilizes the ankle in all planes of motion.",
    prevention: "Prevents ankle instability and improves circulation.",
    category: "Ankles",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },
  {
    name: "Seated Calf Pumps",
    durationSeconds: 60,
    instructions: ["Keep your toes on the floor and lift your heels high.", "Then keep your heels down and lift your toes high.", "Alternate rapidly for 60 seconds."],
    benefits: "Activates the 'Second Heart' (calf muscles).",
    prevention: "Prevents deep vein thrombosis (DVT) and lower leg swelling.",
    category: "Ankles",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },

  // --- ELBOWS ---
  {
    name: "Ulnar Nerve Glide",
    durationSeconds: 60,
    instructions: ["Make an 'OK' sign with fingers.", "Flip the hand upside down and place over your eye like a mask.", "Slowly point elbow away. 30s per side."],
    benefits: "Releases the nerve that causes 'funny bone' pain.",
    prevention: "Prevents Cubital Tunnel Syndrome.",
    category: "Elbows",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  }
];
