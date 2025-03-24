import React from "react"
import { FaPlus, FaTrash, FaQuestionCircle } from "react-icons/fa"

const FAQsForm = ({
  faqs = [],
  errors = {},
  onFaqChange,
  onAddFaq,
  onRemoveFaq,
}) => {
  return (
    <div className="space-y-6">
      {faqs.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FaQuestionCircle className="mx-auto h-10 w-10 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No FAQs added
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Help attendees by adding frequently asked questions
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={onAddFaq}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="-ml-1 mr-2 h-4 w-4" />
              Add FAQ
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Frequently Asked Questions ({faqs.length})
            </h3>
            <button
              type="button"
              onClick={onAddFaq}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="-ml-0.5 mr-1 h-3 w-3" />
              Add
            </button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative"
              >
                <button
                  type="button"
                  onClick={() => onRemoveFaq(index)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 focus:outline-none"
                  title="Remove FAQ"
                >
                  <FaTrash className="h-4 w-4" />
                </button>

                <div>
                  <label
                    htmlFor={`faq-question-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Question
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaQuestionCircle className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id={`faq-question-${index}`}
                      value={faq.question || ""}
                      onChange={(e) =>
                        onFaqChange(index, "question", e.target.value)
                      }
                      className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="What is the question?"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor={`faq-answer-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Answer
                  </label>
                  <textarea
                    id={`faq-answer-${index}`}
                    rows={3}
                    value={faq.answer || ""}
                    onChange={(e) =>
                      onFaqChange(index, "answer", e.target.value)
                    }
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Provide a clear and concise answer"
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="text-sm text-gray-500 pt-2">
        <p>
          Good FAQs help reduce support inquiries and make attendees feel more
          confident about your event.
        </p>
      </div>
    </div>
  )
}

export default FAQsForm
