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
      "Imagine a drawer is open in your neck.",
      "Slide your chin straight back to close it. You should create a double chin.",
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
      "Turn your head 45 degrees towards the other side and look down toward your armpit.",
      "Gently assist with the free hand. Switch sides after 30 seconds."
    ],
    benefits: "Releases tension in the upper neck and shoulder area.",
    prevention: "Relieves mechanical neck pain and prevents tension-type headaches (TTH).",
    category: "Neck",
    posture: "Seated",
    environmentCompatibility: "Both"
  },
  {
    name: "Neck Side Stretch",
    durationSeconds: 60,
    instructions: [
      "Sit on your right hand to 'anchor' your right shoulder down.",
      "Slowly tilt your left ear toward your left shoulder.",
      "Do not lift your left shoulder to meet your ear; keep it low.",
      "Hold for 30 seconds, feeling the long pull on the side of your neck, then switch."
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
      "Sit or stand tall with arms hang heavy at your sides.",
      "Imagine there is a pencil sitting vertically between your shoulder blades.",
      "Try to pinch that pencil by pulling your shoulders back and down (away from your ears).",
      "Hold for 5 seconds, relax and repeat."
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
      "Stand with your back, head, glutes and shoulders flat against a wall.",
      "Place your arms against the wall in a  'W' shape (elbows at shoulder height).",
      "Slowly slide your hands upward into a 'Y' shape, keeping your elbows and the back of your hands touching the wall the whole time.",
      "Slide back down to the 'W' and repeat."
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
      "Extend one arm straight out in front of you, palm facing the floor.",
      "Make a 'Stop' sign: Pull your fingers back toward your face so your palm faces forward.",
      "The Tilt: Gently tilt your head away from your extended arm (ear to opposite shoulder).",
      "The Release: Lower your hand and bring your head back to center. Repeat smoothly."
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
      "Sit at the edge of your chair with feet flat - no back slouching.",
      "Place your right hand on your left knee and your left hand on the back of the chair",
      "Twist from your belly button first, then chest, then look over your left shoulder.",
      "Hold for 5 seconds, then switch sides."
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
      "Inhale: look up and puff your chest out, gently arch your back.",
      "Exhale: look down and slouch deeply, tuck your tailbone round your spine.",
      "Move with your breath."
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
      "Stand up and take a small step back with your right leg (like a shallow lunge).",
      "Tuck your tailbone under (like a dog tucking its tail). You should feel a pull in the front of your right hip.",
      "Squeeze your right glute (butt muscle) to increase the stretch.",
      "Hold 30 seconds then switch legs."
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
  {
    name: "Seated Knee Hug",
    durationSeconds: 60,
    instructions: [
      "Sit near the front edge of your chair.",
      "Lift one knee and wrap both arms around it, pulling it toward your chest.",
      "Keep your back tall—don't lean back into the chair.",
      "Hold for 30 seconds, then switch legs."
    ],
    benefits: "Gently stretches the knee joint and lower back.",
    prevention: "Relieves joint pressure from keeping knees bent at 90 degrees for too long.",
    category: "Knees",
    posture: "Seated",
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
  {
    name: "Heel-Toe Rocks",
    durationSeconds: 60,
    instructions: [
      "Stand tall (hold your desk for balance if needed).",
      "Rock back onto your heels to lift your toes off the floor.",
      "Rock forward onto your toes to lift your heels off the floor.",
      "Repeat the rocking motion at a steady, rhythmic pace."
    ],
    benefits: "Strengthens the stabilizing muscles around the ankle.",
    prevention: "Improves balance and prevents ankle stiffness/weakness from inactivity.",
    category: "Ankles",
    posture: "Standing",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },

  // --- ELBOWS ---
  {
    name: "Ulnar Nerve Glide",
    durationSeconds: 60,
    instructions: [
      "Make an ‘OK’ sign with your fingers (touch thumb and index finger).",
      "Rotate your hand toward your face and place the 'O' over your eye like a monocle.",
      "Your other three fingers should point down toward your jaw/neck, and your elbow should be pointed out to the side.",
      "Hold for 2 seconds, move the hand away, and repeat."
    ],
    benefits: "Encourages smooth elbow and nerve movement.",
    prevention: "Prevents Cubital Tunnel Syndrome and ulnar nerve entrapment at the elbow.",
    category: "Elbows",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },
  {
    name: "Radial Nerve Glide",
    durationSeconds: 60,
    instructions: [
      "Drop one arm to your side, palm facing your thigh.",
      "Rotate your whole arm inward so your palm faces behind you.",
      "Flex your wrist so your palm points up toward the ceiling.",
      "Tilt your head away from this arm (ear to opposite shoulder) and repeat smoothly."
    ],
    benefits: "Releases tension along the top of the forearm and elbow.",
    prevention: "Prevents 'Tennis Elbow' symptoms and radial nerve entrapment.",
    category: "Elbows",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  },
  {
    name: "Forearm Reset",
    durationSeconds: 60,
    instructions: [
      "Extend one arm forward with the palm facing down.",
      "Use your other hand to gently pull your fingers down toward the floor.",
      "Hold for 15 seconds, then flip the hand (palm up) and pull fingers back.",
      "Switch arms after 30 seconds."
    ],
    benefits: "Stretches the muscles that control the elbow and wrist.",
    prevention: "Reduces the risk of lateral and medial epicondylitis (tendon strain).",
    category: "Elbows",
    posture: "Seated",
    isStandingRecommended: true,
    environmentCompatibility: "Both"
  }
];