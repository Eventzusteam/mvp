import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  Tag,
  Users,
  Calendar,
  HelpCircle,
  PlusCircle,
  X,
  Trash2,
} from "lucide-react"

const AdditionalDetails = ({ formData, updateFormData }) => {
  const [newTag, setNewTag] = useState("")
  const [newSponsor, setNewSponsor] = useState({
    name: "",
    logo: null,
    website: "",
  })
  const [newSpeaker, setNewSpeaker] = useState({
    name: "",
    bio: "",
    photo: null,
    company: "",
  })
  const [newAgendaItem, setNewAgendaItem] = useState({
    time: "",
    title: "",
    description: "",
    speaker: "",
  })
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" })

  const handleAddTag = (e) => {
    e.preventDefault()
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateFormData("additional", { tags: [...formData.tags, newTag.trim()] })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag) => {
    updateFormData("additional", {
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  const handleAddSponsor = (e) => {
    e.preventDefault()
    if (newSponsor.name.trim()) {
      updateFormData("additional", {
        sponsors: [...formData.sponsors, { ...newSponsor, id: Date.now() }],
      })
      setNewSponsor({ name: "", logo: null, website: "" })
    }
  }

  const handleRemoveSponsor = (id) => {
    updateFormData("additional", {
      sponsors: formData.sponsors.filter((s) => s.id !== id),
    })
  }

  const handleAddSpeaker = (e) => {
    e.preventDefault()
    if (newSpeaker.name.trim()) {
      updateFormData("additional", {
        speakers: [...formData.speakers, { ...newSpeaker, id: Date.now() }],
      })
      setNewSpeaker({ name: "", bio: "", photo: null, company: "" })
    }
  }

  const handleRemoveSpeaker = (id) => {
    updateFormData("additional", {
      speakers: formData.speakers.filter((s) => s.id !== id),
    })
  }

  const handleAddAgendaItem = (e) => {
    e.preventDefault()
    if (newAgendaItem.title.trim() && newAgendaItem.time.trim()) {
      updateFormData("additional", {
        agenda: [...formData.agenda, { ...newAgendaItem, id: Date.now() }],
      })
      setNewAgendaItem({ time: "", title: "", description: "", speaker: "" })
    }
  }

  const handleRemoveAgendaItem = (id) => {
    updateFormData("additional", {
      agenda: formData.agenda.filter((item) => item.id !== id),
    })
  }

  const handleAddFaq = (e) => {
    e.preventDefault()
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      updateFormData("additional", {
        faqs: [...formData.faqs, { ...newFaq, id: Date.now() }],
      })
      setNewFaq({ question: "", answer: "" })
    }
  }

  const handleRemoveFaq = (id) => {
    updateFormData("additional", {
      faqs: formData.faqs.filter((item) => item.id !== id),
    })
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Additional Event Information
        </h3>

        {/* Tags Section */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Tag
              size={16}
              className="mr-2"
            />
            <h4 className="text-sm font-medium text-gray-900">Event Tags</h4>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Add relevant tags to help people discover your event
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>

          <form
            onSubmit={handleAddTag}
            className="flex"
          >
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              className="flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add
            </button>
          </form>
        </div>

        {/* Sponsors Section */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Users
              size={16}
              className="mr-2"
            />
            <h4 className="text-sm font-medium text-gray-900">Sponsors</h4>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Add organizations sponsoring this event
          </p>

          {formData.sponsors.length > 0 && (
            <div className="space-y-3 mb-4">
              {formData.sponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="bg-gray-50 p-3 rounded-md border border-gray-200 flex justify-between items-center"
                >
                  <div>
                    <h5 className="font-medium text-sm">{sponsor.name}</h5>
                    {sponsor.website && (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {sponsor.website}
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSponsor(sponsor.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h5 className="text-sm font-medium mb-3">Add Sponsor</h5>
            <form
              onSubmit={handleAddSponsor}
              className="space-y-3"
            >
              <div>
                <label
                  htmlFor="sponsorName"
                  className="block text-xs font-medium text-gray-700"
                >
                  Sponsor Name*
                </label>
                <input
                  type="text"
                  id="sponsorName"
                  value={newSponsor.name}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, name: e.target.value })
                  }
                  placeholder="e.g. Acme Corporation"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="sponsorWebsite"
                  className="block text-xs font-medium text-gray-700"
                >
                  Website
                </label>
                <input
                  type="url"
                  id="sponsorWebsite"
                  value={newSponsor.website}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, website: e.target.value })
                  }
                  placeholder="e.g. https://example.com"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="sponsorLogo"
                  className="block text-xs font-medium text-gray-700"
                >
                  Logo
                </label>
                <input
                  type="file"
                  id="sponsorLogo"
                  accept="image/*"
                  onChange={(e) =>
                    setNewSponsor({
                      ...newSponsor,
                      logo: e.target.files[0] || null,
                    })
                  }
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusCircle
                    size={16}
                    className="mr-2"
                  />
                  Add Sponsor
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Speakers Section */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Users
              size={16}
              className="mr-2"
            />
            <h4 className="text-sm font-medium text-gray-900">Speakers</h4>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Add speakers or presenters for your event
          </p>

          {formData.speakers.length > 0 && (
            <div className="space-y-3 mb-4">
              {formData.speakers.map((speaker) => (
                <div
                  key={speaker.id}
                  className="bg-gray-50 p-3 rounded-md border border-gray-200 flex justify-between"
                >
                  <div>
                    <h5 className="font-medium text-sm">{speaker.name}</h5>
                    {speaker.company && (
                      <p className="text-xs text-gray-600">{speaker.company}</p>
                    )}
                    {speaker.bio && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {speaker.bio}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpeaker(speaker.id)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h5 className="text-sm font-medium mb-3">Add Speaker</h5>
            <form
              onSubmit={handleAddSpeaker}
              className="space-y-3"
            >
              <div>
                <label
                  htmlFor="speakerName"
                  className="block text-xs font-medium text-gray-700"
                >
                  Speaker Name*
                </label>
                <input
                  type="text"
                  id="speakerName"
                  value={newSpeaker.name}
                  onChange={(e) =>
                    setNewSpeaker({ ...newSpeaker, name: e.target.value })
                  }
                  placeholder="e.g. Jane Smith"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="speakerCompany"
                  className="block text-xs font-medium text-gray-700"
                >
                  Company/Organization
                </label>
                <input
                  type="text"
                  id="speakerCompany"
                  value={newSpeaker.company}
                  onChange={(e) =>
                    setNewSpeaker({ ...newSpeaker, company: e.target.value })
                  }
                  placeholder="e.g. Acme Corporation"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="speakerBio"
                  className="block text-xs font-medium text-gray-700"
                >
                  Bio
                </label>
                <textarea
                  id="speakerBio"
                  value={newSpeaker.bio}
                  onChange={(e) =>
                    setNewSpeaker({ ...newSpeaker, bio: e.target.value })
                  }
                  placeholder="Brief description of the speaker"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="speakerPhoto"
                  className="block text-xs font-medium text-gray-700"
                >
                  Photo
                </label>
                <input
                  type="file"
                  id="speakerPhoto"
                  accept="image/*"
                  onChange={(e) =>
                    setNewSpeaker({
                      ...newSpeaker,
                      photo: e.target.files[0] || null,
                    })
                  }
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusCircle
                    size={16}
                    className="mr-2"
                  />
                  Add Speaker
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Agenda Section */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Calendar
              size={16}
              className="mr-2"
            />
            <h4 className="text-sm font-medium text-gray-900">Event Agenda</h4>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Create a schedule for your event
          </p>

          {formData.agenda.length > 0 && (
            <div className="space-y-3 mb-4">
              {formData.agenda.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 p-3 rounded-md border border-gray-200 flex justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-sm">{item.title}</h5>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {item.time}
                      </span>
                    </div>
                    {item.speaker && (
                      <p className="text-xs text-gray-600 mt-1">
                        Speaker: {item.speaker}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAgendaItem(item.id)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h5 className="text-sm font-medium mb-3">Add Agenda Item</h5>
            <form
              onSubmit={handleAddAgendaItem}
              className="space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="agendaTime"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Time*
                  </label>
                  <input
                    type="text"
                    id="agendaTime"
                    value={newAgendaItem.time}
                    onChange={(e) =>
                      setNewAgendaItem({
                        ...newAgendaItem,
                        time: e.target.value,
                      })
                    }
                    placeholder="e.g. 9:00 AM - 10:30 AM"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="agendaSpeaker"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Speaker
                  </label>
                  <input
                    type="text"
                    id="agendaSpeaker"
                    value={newAgendaItem.speaker}
                    onChange={(e) =>
                      setNewAgendaItem({
                        ...newAgendaItem,
                        speaker: e.target.value,
                      })
                    }
                    placeholder="e.g. Jane Smith"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="agendaTitle"
                  className="block text-xs font-medium text-gray-700"
                >
                  Title*
                </label>
                <input
                  type="text"
                  id="agendaTitle"
                  value={newAgendaItem.title}
                  onChange={(e) =>
                    setNewAgendaItem({
                      ...newAgendaItem,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Opening Keynote"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="agendaDescription"
                  className="block text-xs font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="agendaDescription"
                  value={newAgendaItem.description}
                  onChange={(e) =>
                    setNewAgendaItem({
                      ...newAgendaItem,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of the session"
                  rows={2}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusCircle
                    size={16}
                    className="mr-2"
                  />
                  Add Session
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <HelpCircle
              size={16}
              className="mr-2"
            />
            <h4 className="text-sm font-medium text-gray-900">
              Frequently Asked Questions
            </h4>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Add FAQs to help attendees find answers to common questions
          </p>

          {formData.faqs.length > 0 && (
            <div className="space-y-3 mb-4">
              {formData.faqs.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 p-3 rounded-md border border-gray-200 flex justify-between"
                >
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{item.question}</h5>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {item.answer}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(item.id)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h5 className="text-sm font-medium mb-3">Add FAQ</h5>
            <form
              onSubmit={handleAddFaq}
              className="space-y-3"
            >
              <div>
                <label
                  htmlFor="faqQuestion"
                  className="block text-xs font-medium text-gray-700"
                >
                  Question*
                </label>
                <input
                  type="text"
                  id="faqQuestion"
                  value={newFaq.question}
                  onChange={(e) =>
                    setNewFaq({ ...newFaq, question: e.target.value })
                  }
                  placeholder="e.g. What is the refund policy?"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="faqAnswer"
                  className="block text-xs font-medium text-gray-700"
                >
                  Answer*
                </label>
                <textarea
                  id="faqAnswer"
                  value={newFaq.answer}
                  onChange={(e) =>
                    setNewFaq({ ...newFaq, answer: e.target.value })
                  }
                  placeholder="Provide a clear answer to the question"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusCircle
                    size={16}
                    className="mr-2"
                  />
                  Add FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdditionalDetails
