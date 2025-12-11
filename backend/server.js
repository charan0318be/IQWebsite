
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Razorpay from "razorpay";

dotenv.config();
console.log("🔹 Loaded Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
console.log("🔹 Loaded Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 50 IQ questions
const questions = [
  {
    id: 1,
    question: "Sequence: 2, 6, 12, 20, 30, ?",
    options: ["36", "40", "42", "48"],
    answer: "42"
  },
  { id: 2, question: "Analogy: BOOK is to READING as FORK is to —", options: ["EAT","COOK","KITCHEN","METAL"], answer: "EAT" },
  { id: 3, question: "Number pattern: 5, 9, 17, 33, 65, ?", options: ["127","129","131","135"], answer: "129" },
  { id: 4, question: "If MONDAY is coded as 721415, what is FRIDAY coded as?", options: ["61549125","65194125","61194125","65194120"], answer: "65194125" },
  { id: 5, question: "If all A are B, and some B are C, which is true?", options: ["All A are C","Some A are C","All C are B","Cannot be determined"], answer: "Cannot be determined" },
  { id: 6, question: "Pattern: Find missing: ▲ ■ ■ ▲ ■ ■ ▲ ?", options: ["■","▲","◆","○"], answer: "■" },
  { id: 7, question: "Arithmetic: 3/4 of a number is 45. What is the number?", options: ["60","55","75","90"], answer: "60" },
  { id: 8, question: "Word relationship: Which word does NOT belong? {PEN, PENCIL, ERASER, RULER}", options: ["PEN","PENCIL","ERASER","RULER"], answer: "ERASER" },
  { id: 9, question: "Numeric analogy: 8 : 64 :: 6 : ?", options: ["18","36","216","48"], answer: "36" },
  { id: 10, question: "Syllogism: All dogs are mammals. Some mammals are pets. Are all dogs pets?", options: ["Yes","No","Only sometimes","Cannot determine"], answer: "Cannot determine" },
  { id: 11, question: "Sequence: 1, 1, 2, 3, 5, 8, ?", options: ["10","11","12","13"], answer: "13" },
  { id: 12, question: "Logical puzzle: Tom is older than Raj. Raj is younger than Sam. Who is middle-aged?", options: ["Tom","Raj","Sam","Cannot say"], answer: "Raj" },
  { id: 13, question: "Pattern: Find the next: 7, 14, 11, 22, 19, 38, ?", options: ["35","76","31","57"], answer: "35" },
  { id: 14, question: "Basic algebra: If 5x − 3 = 2x + 12, x = ?", options: ["3","5","6","7"], answer: "5" },
  { id: 15, question: "Spatial: If you fold a paper cross with four flaps inward, how many 90° rotations bring it back to same orientation?", options: ["1","2","3","4"], answer: "4" },
  { id: 16, question: "Percent: 20% of what number is 50?", options: ["250","200","300","400"], answer: "250" },
  { id: 17, question: "Analogy: DOCTOR is to HOSPITAL as TEACHER is to —", options: ["SCHOOL","PATIENT","MEDICINE","WARD"], answer: "SCHOOL" },
  { id: 18, question: "Sequence (digits): 2, 5, 10, 17, 26, ?", options: ["35","37","38","41"], answer: "37" },
  { id: 19, question: "Logic: If some X are Y, and no Y are Z, then —", options: ["Some X are Z","No X are Z","All X are Z","Cannot determine"], answer: "Cannot determine" },
  { id: 20, question: "Word puzzle: Rearrange 'LISTEN' to form another English word:", options: ["SILENT","LISTNE","LINTES","TINSLE"], answer: "SILENT" },
  { id: 21, question: "Numeric sequence: 81, 27, 9, 3, ?", options: ["1","0","6","9"], answer: "1" },
  { id: 22, question: "Which number is missing? 4, 9, 16, ?, 36", options: ["20","25","24","30"], answer: "25" },
  { id: 23, question: "Probability: A fair coin is tossed twice. Probability of getting exactly one head?", options: ["1/4","1/2","3/4","2/3"], answer: "1/2" },
  { id: 24, question: "Pattern: Complete: Z, X, V, T, ?", options: ["R","S","Q","P"], answer: "R" },
  { id: 25, question: "Math puzzle: Sum of first 10 natural numbers = ?", options: ["55","45","65","50"], answer: "55" },
  { id: 26, question: "Logical: If all cats are animals and some animals are pets, can we say some cats are pets?", options: ["Yes","No","Maybe","Never"], answer: "Maybe" },
  { id: 27, question: "Series: 2, 3, 5, 9, 17, ?", options: ["31","33","29","35"], answer: "33" },
  { id: 28, question: "Verbal: Choose the odd one out: APPLE, ORANGE, TOMATO, BANANA", options: ["APPLE","ORANGE","TOMATO","BANANA"], answer: "TOMATO" },
  { id: 29, question: "Numeric: If x = 3 and y = 4, value of (x³ + y³) / (x + y) = ?", options: ["11","12","13","14"], answer: "13" },
  { id: 30, question: "Sequence: 4, 6, 9, 13, 18, ?", options: ["22","24","25","27"], answer: "24" },
  { id: 31, question: "Logical: Which conclusion follows? All roses are flowers. Some flowers fade quickly.", options: ["Some roses fade quickly","No roses fade quickly","All flowers are roses","Cannot be deduced"], answer: "Cannot be deduced" },
  { id: 32, question: "Math: 45% of 200 = ?", options: ["90","85","95","100"], answer: "90" },
  { id: 33, question: "Coding logic: In a list [2,4,6,8], rotate right by 1 → result is:", options: ["[8,2,4,6]","[4,6,8,2]","[6,8,2,4]","[2,4,6,8]"], answer: "[8,2,4,6]" },
  { id: 34, question: "Verbal analogy: SINGER is to MICROPHONE as ARTIST is to —", options: ["PALETTE","GALLERY","MUSEUM","STAGE"], answer: "PALETTE" },
  { id: 35, question: "Number puzzle: A prime between 50 and 60?", options: ["51","53","55","57"], answer: "53" },
  { id: 36, question: "Logic grid: If every X is Y and every Y is Z, is every X Z?", options: ["Yes","No","Sometimes","Cannot say"], answer: "Yes" },
  { id: 37, question: "Sequence: 2, 4, 8, 16, ?", options: ["24","30","32","34"], answer: "32" },
  { id: 38, question: "Word odd-one-out: TABLE, CHAIR, CUP, SOFA", options: ["TABLE","CHAIR","CUP","SOFA"], answer: "CUP" },
  { id: 39, question: "Math: What is LCM of 12 and 18?", options: ["36","54","72","18"], answer: "36" },
  { id: 40, question: "Pattern: If A=1, Z=26, what is value of ACE?", options: ["9","8","7","5"], answer: "9" },
  { id: 41, question: "Reasoning: You have three boxes: one with apples only, one with oranges only, one with apples & oranges. Pick one from mixed box.", options: ["Mixed label fixed","Oranges box fixed","Determine full arrangement","Cannot determine"], answer: "Determine full arrangement" },
  { id: 42, question: "Arithmetic: 7 × 8 − 9 = ?", options: ["47","49","50","55"], answer: "47" },
  { id: 43, question: "Series: 100, 90, 81, 73, ?", options: ["66","65","64","63"], answer: "66" },
  { id: 44, question: "Logical: If April 1 is Monday, what day is April 30?", options: ["Monday","Tuesday","Wednesday","Thursday"], answer: "Tuesday" },
  { id: 45, question: "Verbal: An antonym for 'scarcity' is —", options: ["Shortage","Abundance","Lack","Poverty"], answer: "Abundance" },
  { id: 46, question: "Math: Solve for y: 2y + 3 = 17", options: ["6","7","8","9"], answer: "7" },
  { id: 47, question: "Pattern: Which number replaces the question mark? 16 → 8, 32 → 16, 64 → ?", options: ["32","48","40","16"], answer: "32" },
  { id: 48, question: "Logical puzzle: If five people each shake hands once with everyone else in the group, how many handshakes?", options: ["10","20","15","5"], answer: "10" },
  { id: 49, question: "Numerical analogy: 14 is to 28 as 9 is to —", options: ["18","27","36","12"], answer: "18" },
  { id: 50, question: "Pattern & vocabulary: Which of the following words is an anagram of 'REACT'?", options: ["CATER","TRACE","RECTA","Both A and B"], answer: "Both A and B" }
];

function getRandomQuestions(count = 15) {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}


// Route to get questions
app.get("/questions", (req, res) => {
  try {
    const selected = getRandomQuestions(15);
    res.json(selected);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: "Unable to fetch questions" });
  }
});

// Route to create Razorpay order
app.post("/create-order", async (req, res) => {
  try {
    console.log("Received order request with body:", req.body);

    const { amount } = req.body;
    if (!amount) {
      console.error("Amount not provided in request");
      return res.status(400).json({ error: "Amount is required" });
    }

    const options = {
      amount, // in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    console.log("Creating Razorpay order with options:", options);

    const order = await razorpay.orders.create(options);

    console.log("Razorpay order created:", order);
    res.json({ id: order.id, key: process.env.RAZORPAY_KEY_ID, amount: order.amount });
  } catch (err) {
    console.error("Razorpay error:", err);
    res.status(500).json({ error: "Unable to create order", details: err });
  }
});



// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
