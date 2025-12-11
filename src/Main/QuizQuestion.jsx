import React, { useEffect, useState } from "react";
import axios from "axios";

// IQ levels for display
const iqLevels = [
  { min: 130, max: 200, label: "Gifted / Very Superior" },
  { min: 120, max: 129, label: "Superior" },
  { min: 110, max: 119, label: "High Average" },
  { min: 90, max: 109, label: "Average" },
  { min: 80, max: 89, label: "Below Average" },
];

function getIQClassification(score) {
  for (let level of iqLevels) {
    if (score >= level.min && score <= level.max) return level.label;
  }
  return "Unclassified";
}

const QuizQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [iqScore, setIqScore] = useState(0);

  useEffect(() => {
    // Fetch 15 random questions from backend
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/questions`) // Use environment variable
      .then((res) => {
        console.log("Questions fetched:", res.data);
        const shuffled = res.data.sort(() => 0.5 - Math.random()).slice(0, 15);
        setQuestions(shuffled);
      })
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  const handleOptionSelect = (option) => {
    setAnswers({ ...answers, [questions[currentIndex].id]: option });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handlePayment = async () => {
    try {
      console.log("Initiating payment...");
      const orderRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/create-order`,
        { amount: 14900 }
      );
      console.log("Order response from backend:", orderRes.data);

      const { id: order_id, key } = orderRes.data;

      const options = {
        key: key, // Use live key received from backend
        amount: 14900,
        currency: "INR",
        name: "IQ Checker",
        description: "IQ Test Payment",
        order_id: order_id,
        handler: function (response) {
          console.log("Payment successful:", response);
          setPaymentDone(true);
          calculateIQ();
        },
        theme: { color: "#1D4ED8" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err) {
      console.error("Payment error", err);
      alert("Unable to initiate payment. Check console for details.");
    }
  };

  const calculateIQ = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) correct++;
    });
    const score = 70 + Math.round((correct / questions.length) * 50);
    setIqScore(score);
    console.log("IQ calculated:", score);
  };

  if (!questions.length) return <p className="text-center mt-10">Loading questions...</p>;

  if (!quizFinished) {
    const q = questions[currentIndex];
    return (
      <div className="max-w-2xl mx-auto p-5 space-y-4">
        <h2 className="text-2xl font-bold text-center mb-4">Test Your IQ</h2>
        <div className="p-4 border rounded shadow-sm bg-white">
          <p className="font-semibold mb-3">
            Q{currentIndex + 1}. {q.question}
          </p>
          <div className="flex flex-col gap-2">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                className={`p-2 border rounded hover:bg-blue-50 transition ${
                  answers[q.id] === opt ? "bg-blue-100 border-blue-400" : "bg-white"
                }`}
                onClick={() => handleOptionSelect(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              Previous
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={handleNext}
              disabled={!answers[q.id]}
            >
              {currentIndex === questions.length - 1 ? "Finish & Pay ₹149" : "Next"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentDone) {
    return (
      <div className="max-w-xl mx-auto p-5 text-center">
        <h2 className="text-xl font-bold mb-4">Complete Payment to View Your IQ Score</h2>
        <button
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          onClick={handlePayment}
        >
          Pay ₹149
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-5 space-y-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl text-center mb-6">
  <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>

  {/* Result Classification */}
  <p className="text-xl mb-2">
    Your IQ Classification: {getIQClassification(iqScore)}
  </p>

  {/* Score Details */}
  <p className="text-gray-600 mb-2">
    You answered {
      questions.filter(q => answers[q.id] === q.answer).length
    } out of {questions.length} questions correctly.
  </p>

  <p className="text-gray-600">Your IQ Score: {iqScore}</p>
</div>

      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-xl mx-auto">
                <h3 className="text-xl font-bold mb-4">IQ Classification Table</h3>
    <table className="w-full border-collapse border border-gray-300 text-left">
    <thead>
      <tr className="bg-gray-200">
        <th className="border border-gray-300 p-2">Classification</th>
        <th className="border border-gray-300 p-2">IQ Range</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border border-gray-300 p-2">Gifted / Very Superior</td>
        <td className="border border-gray-300 p-2">130+</td>
      </tr>
      <tr>
        <td className="border border-gray-300 p-2">Superior</td>
        <td className="border border-gray-300 p-2">120–129</td>
      </tr>
      <tr>
        <td className="border border-gray-300 p-2">High Average</td>
        <td className="border border-gray-300 p-2">110–119</td>
      </tr>
      <tr>
        <td className="border border-gray-300 p-2">Average</td>
        <td className="border border-gray-300 p-2">90–109</td>
      </tr>
      <tr>
        <td className="border border-gray-300 p-2">Below Average</td>
        <td className="border border-gray-300 p-2">80–89</td>
      </tr>
    </tbody>
  </table>
</div>


     
     
    </div>
  );
};

export default QuizQuestion;
