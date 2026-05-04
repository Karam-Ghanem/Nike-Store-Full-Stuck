  
  
  export type CheckBoxItem = {
  qustion: string;
  answers: string[];
  answersSelected: string[];
};

export type RadioItem = {
  qustion: string;
  answers: string[];
  selected: string;
};
  
  
 export const initialCheckBoxData: CheckBoxItem[] = [
    {
      qustion: "Issues you faced",
      answers: [
        "Payment issues",
        "Size issues",
        "Image issues",
        "Delivery issues",
      ],
      answersSelected: [],
    },
    {
      qustion: "Negative points",
      answers: [
        "Difficulty finding the product",
        "Size issues",
        "Image issues",
        "Payment issues",
        "Delivery issues",
        "Login issues",
      ],
      answersSelected: [],
    },
    {
      qustion: "Shoe‑related points (without evaluating Nike itself)",
      answers: [
        "Matching Nike’s original quality",
        "Matching the requested size",
        "Matching the color and images",
        "Comfort when wearing the shoe",
      ],
      answersSelected: [],
    },
    {
      qustion: "What did you like most about the website?",
      answers: [
        "Overall shopping experience",
        "Fast page loading",
        "Easy payment process",
        "Variety of products",
        "Clear sizing",
        "Fast delivery",
        "Ease of use",
      ],
      answersSelected: [],
    },
    {
      qustion: "What would you like to see improved?",
      answers: [
        "Improve customer service",
        "Improve search experience",
        "Add more payment methods",
        "Improve product images",
        "Improve size presentation",
        "Improve user interface",
        "Improve website speed",
      ],
      answersSelected: [],
    },
    {
      qustion: "Payment issues you faced",
      answers: [
        "Couldn’t complete the payment",
        "Verification code didn’t arrive",
        "Page froze",
        "Card was not accepted",
      ],
      answersSelected: [],
    },
    {
      qustion: "Delivery issues you faced",
      answers: [
        "Product arrived in poor condition",
        "Product arrived late",
        "Wrong address issue",
        "Delivery delay",
      ],
      answersSelected: [],
    },
  ];



  // RADIO DATA (مع selected)
  export const initialRadioData: RadioItem[] = [
    {
      qustion: "Rate the ease of using the website",
      answers: ["Excellent", "Good", "Acceptable", "Poor"],
      selected: "",
    },
    {
      qustion: "Rate the delivery speed",
      answers: ["Fast", "Acceptable", "Slow"],
      selected: "",
    },
    {
      qustion: "Rate your overall shopping experience",
      answers: ["Excellent", "Good", "Poor"],
      selected: "",
    },
    {
      qustion: "Rate the clarity of product images",
      answers: ["Excellent", "Good", "Acceptable", "Poor"],
      selected: "",
    },
    {
      qustion: "Rate the clarity of sizing information",
      answers: ["Clear", "Acceptable", "Not clear"],
      selected: "",
    },
    {
      qustion: "Rate the responsiveness of customer service",
      answers: [
        "Fast",
        "Acceptable",
        "Slow",
        "I did not contact customer service",
      ],
      selected: "",
    },
    {
      qustion: "Rate the ease of the payment process",
      answers: ["Easy", "Acceptable", "Difficult"],
      selected: "",
    },
    {
      qustion: "Rate the packaging quality",
      answers: ["Excellent", "Good", "Acceptable", "Poor"],
      selected: "",
    },
    {
      qustion: "Rate the website loading speed",
      answers: ["Fast", "Acceptable", "Slow"],
      selected: "",
    },
  ];


