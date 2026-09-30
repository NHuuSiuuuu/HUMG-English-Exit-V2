import type { PracticeItemDetail, PracticeItemSummary } from "../types/practice";

// Dữ liệu mẫu bài luyện tự biên soạn chuẩn format Cambridge KET A2 theo AGENTS.md
export const MOCK_PRACTICE_ITEMS: PracticeItemDetail[] = [
  // PART 1: Biển báo (Match Pool)
  {
    id: "p1-bai-1",
    partNo: 1,
    skill: "reading_writing",
    title: "Part 1 — Biển báo thông báo",
    sourceLabel: "KET 5 · Test 1",
    groupSet: "KET 5",
    questionGroup: {
      id: "qg-p1-1",
      type: "match_pool",
      title: "Questions 1 – 5",
      instruction: "Nối câu mô tả (1–5) với biển báo/thông báo phù hợp (A–H). Có 3 biển báo không được sử dụng.",
      example: {
        question: "You can not pay by credit card here.",
        correctAnswer: "E",
        explanation: "Biển E ghi 'CASH ONLY AT THIS TILL', nghĩa là chỉ chấp nhận tiền mặt, không dùng thẻ tín dụng.",
      },
      poolOptions: [
        { letter: "A", title: "CAMPING SITE", text: "No music or loud noise after 10 p.m." },
        { letter: "B", title: "AIRPORT EXPRESS", text: "Trains run every 15 minutes day and night." },
        { letter: "C", title: "LIBRARY NOTICE", text: "Please return all books to the front desk before leaving." },
        { letter: "D", title: "SWIMMING POOL", text: "Children under 12 must swim with an adult." },
        { letter: "E", title: "STORE CHECKOUT", text: "CASH ONLY AT THIS TILL - CARDS NOT ACCEPTED." },
        { letter: "F", title: "CITY PARK", text: "Keep off the grass during maintenance." },
        { letter: "G", title: "BUS STOP", text: "Next bus to Railway Station arrives in 10 mins." },
        { letter: "H", title: "CAFE", text: "Free tea or coffee with every sandwich purchased today." },
      ],
      items: [
        { id: "q1", orderNumber: 1, prompt: "Young people need to be with someone older here." },
        { id: "q2", orderNumber: 2, prompt: "You can travel to the planes at any time." },
        { id: "q3", orderNumber: 3, prompt: "You must be quiet late in the evening." },
        { id: "q4", orderNumber: 4, prompt: "You can get a free drink if you buy food." },
        { id: "q5", orderNumber: 5, prompt: "Bring what you borrowed back to the staff." },
      ],
    },
  },
  {
    id: "p1-bai-2",
    partNo: 1,
    skill: "reading_writing",
    title: "Part 1 — Biển báo trường học & nhà ga",
    sourceLabel: "KET 5 · Test 2",
    groupSet: "KET 5",
    questionGroup: {
      id: "qg-p1-2",
      type: "match_pool",
      title: "Questions 1 – 5",
      instruction: "Nối câu mô tả (1–5) với biển báo phù hợp (A–H).",
      poolOptions: [
        { letter: "A", title: "CAR PARK", text: "Free parking for college students with valid permit." },
        { letter: "B", title: "CINEMA", text: "Buy tickets online to get 20% discount." },
        { letter: "C", title: "MUSEUM", text: "Do not touch the stone statues on display." },
        { letter: "D", title: "GYM", text: "Showers closed for repairs until Friday morning." },
        { letter: "E", title: "METRO STATION", text: "Mind the gap between the train and the platform." },
        { letter: "F", title: "LABORATORY", text: "Wear safety glasses and coat at all times inside." },
        { letter: "G", title: "BOOKSHOP", text: "Second-hand course books bought and sold here." },
        { letter: "H", title: "CANTEEN", text: "Hot lunch served between 11:30 and 13:30." },
      ],
      items: [
        { id: "q1", orderNumber: 1, prompt: "It costs less if you purchase your seat on the internet." },
        { id: "q2", orderNumber: 2, prompt: "You must protect your eyes and clothing in this room." },
        { id: "q3", orderNumber: 3, prompt: "You cannot wash here for a few days." },
        { id: "q4", orderNumber: 4, prompt: "You can sell your old textbooks in this place." },
        { id: "q5", orderNumber: 5, prompt: "Look where you walk when getting on the transport." },
      ],
    },
  },

  // PART 2: Từ vựng (MCQ3)
  {
    id: "p2-bai-1",
    partNo: 2,
    skill: "reading_writing",
    title: "Part 2 — Từ vựng theo chủ đề: Du lịch",
    sourceLabel: "KET 5 · Test 1",
    groupSet: "KET 5",
    questionGroup: {
      id: "qg-p2-1",
      type: "mcq3",
      title: "Questions 6 – 10",
      instruction: "Đọc đoạn văn và chọn từ đúng A, B hoặc C để điền vào mỗi chỗ trống.",
      example: {
        question: "Peter loves ______ to new countries during the summer holiday.",
        correctAnswer: "B",
        explanation: "Cấu trúc 'love + V-ing': travelling.",
      },
      items: [
        {
          id: "q6",
          orderNumber: 6,
          prompt: "Last year, Sarah ______ to visit her grandparents in Da Nang.",
          options: [
            { label: "A", text: "decided" },
            { label: "B", text: "thought" },
            { label: "C", text: "remembered" },
          ],
        },
        {
          id: "q7",
          orderNumber: 7,
          prompt: "She ______ her luggage carefully the night before her flight.",
          options: [
            { label: "A", text: "made" },
            { label: "B", text: "packed" },
            { label: "C", text: "carried" },
          ],
        },
        {
          id: "q8",
          orderNumber: 8,
          prompt: "The train journey took four hours, but Sarah didn't feel ______.",
          options: [
            { label: "A", text: "bored" },
            { label: "B", text: "boring" },
            { label: "C", text: "boredom" },
          ],
        },
        {
          id: "q9",
          orderNumber: 9,
          prompt: "Her grandmother made a ______ meal with fresh seafood.",
          options: [
            { label: "A", text: "pleasant" },
            { label: "B", text: "delicious" },
            { label: "C", text: "friendly" },
          ],
        },
        {
          id: "q10",
          orderNumber: 10,
          prompt: "Sarah ______ a lot of wonderful photos to show her classmates.",
          options: [
            { label: "A", text: "caught" },
            { label: "B", text: "held" },
            { label: "C", text: "took" },
          ],
        },
      ],
    },
  },

  // PART 4: Đọc hiểu (Right / Wrong / Doesn't say)
  {
    id: "p4-bai-1",
    partNo: 4,
    skill: "reading_writing",
    title: "Part 4 — Đọc hiểu: Sinh viên khởi nghiệp",
    sourceLabel: "KET 5 · Test 1",
    groupSet: "KET 5",
    questionGroup: {
      id: "qg-p4-1",
      type: "mcq3",
      title: "Questions 21 – 27",
      instruction: "Đọc bài viết về sinh viên khởi nghiệp. Chọn Right (Đúng), Wrong (Sai), hoặc Doesn't say (Không nhắc tới).",
      passageText: `Linh is a third-year mining engineering student at HUMG. When she was in her second year, she noticed that many students struggled to find reliable secondhand surveying tools and calculators.

Together with two classmates, Linh built an online forum where seniors could sell their equipment to younger students at reasonable prices. At first, they only had 50 users, but now more than 1,200 students use the platform each semester. 

Linh spends around 10 hours every week managing the site. Despite her busy schedule, she maintains excellent academic grades and plans to pursue a master's degree after graduation.`,
      items: [
        {
          id: "q21",
          orderNumber: 21,
          prompt: "Linh is currently in her second year of university.",
          options: [
            { label: "A", text: "Right" },
            { label: "B", text: "Wrong" },
            { label: "C", text: "Doesn't say" },
          ],
        },
        {
          id: "q22",
          orderNumber: 22,
          prompt: "Linh started the website alone without any help.",
          options: [
            { label: "A", text: "Right" },
            { label: "B", text: "Wrong" },
            { label: "C", text: "Doesn't say" },
          ],
        },
        {
          id: "q23",
          orderNumber: 23,
          prompt: "The platform now has over a thousand users each semester.",
          options: [
            { label: "A", text: "Right" },
            { label: "B", text: "Wrong" },
            { label: "C", text: "Doesn't say" },
          ],
        },
        {
          id: "q24",
          orderNumber: 24,
          prompt: "Linh earned enough money to buy her own laptop.",
          options: [
            { label: "A", text: "Right" },
            { label: "B", text: "Wrong" },
            { label: "C", text: "Doesn't say" },
          ],
        },
        {
          id: "q25",
          orderNumber: 25,
          prompt: "Linh's university grades suffered because she spent too much time on the forum.",
          options: [
            { label: "A", text: "Right" },
            { label: "B", text: "Wrong" },
            { label: "C", text: "Doesn't say" },
          ],
        },
      ],
    },
  },

  // PART 6: Đoán từ (Short Text có chữ cái đầu)
  {
    id: "p6-bai-1",
    partNo: 6,
    skill: "reading_writing",
    title: "Part 6 — Đoán từ: Đồ dùng học tập & Đời sống",
    sourceLabel: "KET 5 · Test 1",
    groupSet: "KET 5",
    questionGroup: {
      id: "qg-p6-1",
      type: "short_text",
      title: "Questions 36 – 40",
      instruction: "Đọc định nghĩa và điền từ thích hợp. Chữ cái đầu tiên và số ký tự đã được cho sẵn.",
      example: {
        question: "You carry this to keep dry when it rains.",
        correctAnswer: "umbrella",
        explanation: "u _ _ _ _ _ _ _ (8 ký tự) = umbrella.",
      },
      items: [
        {
          id: "q36",
          orderNumber: 36,
          prompt: "You use this electronic device to calculate math problems quickly.",
          firstLetterHint: "c",
          charCountHint: 10,
        },
        {
          id: "q37",
          orderNumber: 37,
          prompt: "You put your money, ID cards and coins inside this small leather item.",
          firstLetterHint: "w",
          charCountHint: 6,
        },
        {
          id: "q38",
          orderNumber: 38,
          prompt: "A building where students can borrow books and read quietly.",
          firstLetterHint: "l",
          charCountHint: 7,
        },
        {
          id: "q39",
          orderNumber: 39,
          prompt: "You look at this piece of paper to check train departures and arrival times.",
          firstLetterHint: "t",
          charCountHint: 9,
        },
        {
          id: "q40",
          orderNumber: 40,
          prompt: "A warm piece of clothing you wear over a shirt when the weather is cold.",
          firstLetterHint: "s",
          charCountHint: 7,
        },
      ],
    },
  },

  // PART 9: Viết note ngắn (Writing)
  {
    id: "p9-bai-1",
    partNo: 9,
    skill: "reading_writing",
    title: "Part 9 — Viết note ngắn: Hẹn học nhóm",
    sourceLabel: "KET 5 · Test 1",
    groupSet: "KET 5",
    questionGroup: {
      id: "qg-p9-1",
      type: "writing",
      title: "Question 56 — Writing Note",
      instruction: "Đọc email từ người bạn cùng lớp Alex. Viết một note ngắn từ 25 đến 35 từ trả lời Alex.",
      passageText: `From: Alex
To: You
Subject: English group study

Hi! When can we meet this week to prepare for the English exit test? Where would you like to study? What books should I bring with me?

See you soon,
Alex`,
      writingRequirements: [
        "Đề xuất thời gian gặp mặt (ngày/giờ cụ thể)",
        "Đề xuất địa điểm học tập (ví dụ thư viện hoặc quán cà phê)",
        "Gợi ý tài liệu hoặc sách cần mang theo",
      ],
      minWords: 25,
      maxWords: 35,
      sampleWriting: `Hi Alex,
Let's meet this Thursday at 2 p.m. in the campus library. Please bring your KET practice book and your grammar notebook so we can do mock tests together.
Best,`,
      items: [
        {
          id: "q56",
          orderNumber: 56,
          prompt: "Viết câu trả lời của bạn vào ô văn bản bên dưới (25–35 từ):",
        },
      ],
    },
  },

  // PART 10: Listening 1 (MCQ3 Image)
  {
    id: "p10-bai-1",
    partNo: 10,
    skill: "listening",
    title: "Part 10 — Listening 1: Tranh hội thoại ngắn",
    sourceLabel: "Đề 01 · Listening",
    groupSet: "Đề thi mẫu",
    questionGroup: {
      id: "qg-p10-1",
      type: "mcq3_image",
      title: "Questions 1 – 5",
      instruction: "Bạn sẽ nghe 5 đoạn hội thoại ngắn. Mỗi câu hỏi chọn 1 bức tranh đúng A, B hoặc C. Bạn được nghe 2 lần.",
      audioUrl: "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg",
      transcript: `Question 1:
Boy: What time does the chemistry lecture start?
Girl: It usually starts at quarter past nine, but today the professor moved it to half past nine.
Boy: Great, that gives us fifteen more minutes.

Question 2:
Woman: How much is this blue cotton shirt?
Man: It was twenty-five pounds last week, but it is on sale today for only eighteen pounds fifty.`,
      items: [
        {
          id: "q1_lis",
          orderNumber: 1,
          prompt: "What time does the lecture start today?",
          options: [
            { label: "A", text: "9:15 AM (Quarter past nine)" },
            { label: "B", text: "9:30 AM (Half past nine)" },
            { label: "C", text: "9:45 AM (Quarter to ten)" },
          ],
        },
        {
          id: "q2_lis",
          orderNumber: 2,
          prompt: "How much did the woman pay for the shirt?",
          options: [
            { label: "A", text: "£18.50" },
            { label: "B", text: "£25.00" },
            { label: "C", text: "£30.00" },
          ],
        },
      ],
    },
  },
];
