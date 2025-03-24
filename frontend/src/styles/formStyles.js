// Common form styles using Tailwind utility classes
const formStyles = {
  // Form layout and container styles
  formContainer: "space-y-8",
  sectionContainer: "bg-white rounded-lg shadow-md p-6 space-y-6",
  sectionHeader: "flex items-start space-x-3 mb-4",
  sectionIcon: "p-2 bg-indigo-100 rounded-full",
  sectionIconSvg: "w-6 h-6 text-indigo-600",
  sectionTitle: "text-xl font-bold text-gray-900",
  sectionDescription: "text-gray-600 mb-6",

  // Form controls
  formGroup: "space-y-2 mb-6",
  label: "block text-sm font-medium text-gray-700",
  labelRequired: "text-red-500 ml-1",
  input:
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
  select:
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
  textarea:
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
  checkbox:
    "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500",
  radio: "h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500",

  // Validation states
  error: "text-sm text-red-600 mt-1",
  valid: "text-sm text-green-600 mt-1",
  inputError:
    "mt-1 block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm",

  // Grid layouts
  grid: "grid grid-cols-1 gap-6 md:grid-cols-2",
  fieldRow: "flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4",

  // Buttons
  buttonPrimary:
    "inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
  buttonSecondary:
    "inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
  buttonIcon:
    "inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",

  // Info messages and tooltips
  infoMessage: "text-sm text-gray-500 mt-1",
  infoBox: "bg-blue-50 border-l-4 border-blue-400 p-4 mb-4",
  infoBoxText: "text-sm text-blue-700",

  // Warning and error messages
  warningBox: "bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4",
  warningBoxText: "text-sm text-yellow-700",
  errorBox: "bg-red-50 border-l-4 border-red-400 p-4 mb-4",
  errorBoxText: "text-sm text-red-700",
}

export default formStyles
