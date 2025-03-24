// Sample event data for development and testing
export const eventData = [
  {
    id: 1,
    title: "Annual Tech Conference 2025",
    description:
      "Join us for the biggest tech conference of the year. This three-day event features keynote speeches, workshops, networking opportunities, and showcases the latest innovations in artificial intelligence, blockchain, cloud computing, and more.\n\nAttendees will have the opportunity to connect with industry leaders, learn about cutting-edge technologies, and gain valuable insights to help their businesses thrive in the digital age. Whether you're a developer, entrepreneur, executive, or tech enthusiast, this conference has something for everyone.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    date: "April 15-17, 2025",
    time: "9:00 AM - 6:00 PM",
    locationType: "physical",
    venue: "Tech Convention Center",
    city: "San Francisco",
    address: "123 Innovation Street",
    state: "CA",
    zip: "94107",
    country: "USA",
    onlineLink: null,
    isVideo: false,
    category: "Technology",
    tags: ["AI", "Blockchain", "Cloud Computing", "Web3", "IoT"],
    price: 499,
    currency: "USD",
    maxAttendees: 2000,
    availableSeats: 768,
    registrationEndDate: "April 10, 2025",
    organiserName: "Tech Innovations Inc.",
    organiserEmail: "events@example.com",
    organiserPhone: "+1 (415) 555-7890",
    organiserWebsite: "https://example.com",
    socialMedia: {
      twitter: "https://twitter.com",
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
    },
    speakers: [
      {
        name: "Dr. Sarah Johnson",
        title: "AI Research Director",
        company: "Future Technologies",
        bio: "Dr. Sarah Johnson is a leading AI researcher with over 15 years of experience in machine learning and neural networks. She has published numerous papers on AI ethics and leads research initiatives focused on responsible AI development.",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        socialLinks: {
          twitter: "https://twitter.com/sarahjohnson",
          linkedin: "https://linkedin.com/in/sarahjohnson",
        },
      },
      {
        name: "Michael Chen",
        title: "CTO",
        company: "BlockChain Ventures",
        bio: "Michael Chen is a blockchain pioneer who has founded three successful startups in the Web3 space. He specializes in blockchain scalability solutions and has been featured in major tech publications worldwide.",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        socialLinks: {
          twitter: "https://twitter.com/michaelchen",
          linkedin: "https://linkedin.com/in/michaelchen",
        },
      },
      {
        name: "Lisa Rodriguez",
        title: "Cloud Architecture Director",
        company: "CloudScale Solutions",
        bio: "Lisa Rodriguez has helped hundreds of companies optimize their cloud infrastructure. She's an expert in multi-cloud strategies, serverless architectures, and cloud security best practices.",
        image:
          "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=689&q=80",
        socialLinks: {
          twitter: "https://twitter.com/lisarodriguez",
          linkedin: "https://linkedin.com/in/lisarodriguez",
        },
      },
    ],
    agenda: [
      {
        title: "Registration & Breakfast",
        time: "8:00 AM - 9:00 AM",
        description:
          "Check-in at the registration desk and enjoy a complimentary breakfast while networking with other attendees.",
      },
      {
        title: "Opening Keynote: The Future of Technology",
        time: "9:00 AM - 10:30 AM",
        speaker: "Dr. Sarah Johnson, AI Research Director",
        description:
          "Dr. Johnson will explore the most significant technological trends that will shape our world over the next decade, with particular focus on how AI will transform industries and societies.",
      },
      {
        title: "Coffee Break & Networking",
        time: "10:30 AM - 11:00 AM",
        description:
          "Refresh and connect with fellow attendees in the main hall.",
      },
      {
        title: "Workshop: Practical Blockchain Applications",
        time: "11:00 AM - 12:30 PM",
        speaker: "Michael Chen, CTO",
        description:
          "This hands-on workshop will demonstrate how to implement blockchain solutions for real-world business problems. Attendees will learn about smart contract development, tokenization strategies, and security considerations.",
      },
      {
        title: "Lunch",
        time: "12:30 PM - 1:30 PM",
        description:
          "Enjoy a catered lunch with opportunities for informal discussions and networking.",
      },
      {
        title: "Panel Discussion: The Cloud Computing Revolution",
        time: "1:30 PM - 3:00 PM",
        speaker: "Lisa Rodriguez, Cloud Architecture Director (Moderator)",
        description:
          "Industry experts debate the future of cloud computing, addressing topics such as multi-cloud strategies, edge computing, and serverless architectures.",
      },
      {
        title: "Afternoon Break",
        time: "3:00 PM - 3:30 PM",
        description:
          "Refresh and browse the innovation showcase in the exhibition hall.",
      },
      {
        title: "Closing Keynote: Technology Ethics for the Next Decade",
        time: "3:30 PM - 5:00 PM",
        speaker: "Panel of Industry Leaders",
        description:
          "A thought-provoking discussion on the ethical considerations that should guide technology development and implementation in the coming years.",
      },
      {
        title: "Networking Reception",
        time: "5:00 PM - 7:00 PM",
        description:
          "Join us for drinks, hors d'oeuvres, and structured networking opportunities with speakers, sponsors, and fellow attendees.",
      },
    ],
    sponsors: [
      {
        name: "CloudScale Solutions",
        level: "Platinum Sponsor",
        logo: "https://picsum.photos/200/80",
        website: "https://cloudscale-solutions.com",
      },
      {
        name: "BlockChain Ventures",
        level: "Gold Sponsor",
        logo: "https://picsum.photos/201/80",
        website: "https://blockchain-ventures.com",
      },
      {
        name: "Future Technologies",
        level: "Gold Sponsor",
        logo: "https://picsum.photos/202/80",
        website: "https://futuretechnologies.com",
      },
      {
        name: "DevOps Masters",
        level: "Silver Sponsor",
        logo: "https://picsum.photos/203/80",
        website: "https://devops-masters.com",
      },
      {
        name: "InnoHub",
        level: "Silver Sponsor",
        logo: "https://picsum.photos/204/80",
        website: "https://innohub.io",
      },
      {
        name: "Tech Startup Fund",
        level: "Bronze Sponsor",
        logo: "https://picsum.photos/205/80",
        website: "https://techstartupfund.com",
      },
    ],
    faqs: [
      {
        question: "What is included in the registration fee?",
        answer:
          "The registration fee includes access to all keynotes, workshops, panel discussions, and networking events. Meals (breakfast, lunch, and refreshments) are also provided on all three days of the conference. Additionally, attendees receive digital access to presentation materials and recordings after the event.",
      },
      {
        question: "Is there a discount for early registration?",
        answer:
          "Yes, we offer an early bird discount of 20% for registrations completed before February 28, 2025. Group discounts are also available for organizations sending 5 or more attendees.",
      },
      {
        question: "Will sessions be recorded?",
        answer:
          "Yes, all keynotes and selected workshops will be recorded. Registered attendees will receive access to these recordings approximately one week after the conference ends.",
      },
      {
        question: "What is the cancellation policy?",
        answer:
          "Cancellations made before March 15, 2025 will receive a full refund minus a $50 processing fee. Cancellations between March 16 and April 1 will receive a 50% refund. No refunds will be provided for cancellations after April 1, 2025, but registration may be transferred to another person at no additional cost.",
      },
      {
        question: "Is there accommodation available for attendees?",
        answer:
          "We have negotiated special rates with several hotels near the venue. Details on recommended accommodation options are provided in the confirmation email after registration.",
      },
    ],
  },
]
