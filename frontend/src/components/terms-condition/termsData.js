// termsData.js - Mock data for Terms and Conditions

const termsData = {
  lastUpdated: "March 23, 2025",
  sections: [
    {
      id: "overview",
      title: "Overview",
      icon: "FileCheck",
      content: [
        'These Terms and Conditions ("Terms") govern your access to and use of our website, mobile applications, and services (collectively, the "Service").',
        "By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Service.",
      ],
    },
    {
      id: "userAgreement",
      title: "User Agreement",
      icon: "Shield",
      content: [
        "By creating an account with us, you guarantee that you are above the age of 18, and that the information you provide us is accurate, complete, and current at all times.",
        "You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account.",
        "You agree to accept responsibility for any and all activities or actions that occur under your account and/or password. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.",
      ],
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: "Globe",
      content: [
        "Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect from you across our website and other sites we own and operate.",
        "We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.",
        "We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.",
      ],
    },
    {
      id: "limitations",
      title: "Limitations",
      icon: "AlertTriangle",
      content: [
        "In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:",
        [
          "Your access to or use of or inability to access or use the Service;",
          "Any conduct or content of any third party on the Service;",
          "Any content obtained from the Service; and",
          "Unauthorized access, use or alteration of your transmissions or content.",
        ],
      ],
    },
    {
      id: "termination",
      title: "Termination",
      icon: "Clock",
      content: [
        "We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.",
        "If you wish to terminate your account, you may simply discontinue using the Service. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.",
      ],
    },
    {
      id: "governing",
      title: "Governing Law",
      icon: "FileCheck",
      content: [
        "These Terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions.",
        "Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.",
        "These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have had between us regarding the Service.",
      ],
    },
  ],
  companyName: "Your Company Name",
  companyContact: "support@yourcompany.com",
}

export default termsData
