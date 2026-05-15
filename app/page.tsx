"use client"

import { useState } from "react"

export default function Home() {
  const [mails, setMails] = useState([
    {
      id: 1,
      sender: "Amazon",
      subject: "ご注文の商品を発送しました",
      type: "normal",
      unread: true,
      time: "22:14",
    },
    {
      id: 2,
      sender: "SALE INFO",
      subject: "期間限定セール開催中",
      type: "ad",
      unread: false,
      time: "21:03",
    },
    {
      id: 3,
      sender: "友達",
      subject: "今度ご飯行こう",
      type: "normal",
      unread: true,
      time: "20:41",
    },
  ])
  const [hideAds, setHideAds] = useState(true)

  const filteredMails = hideAds
    ? mails.filter((mail) => mail.type !== "ad")
    : mails

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl mb-6 font-light">
          Quiet Mail
        </h1>

        <button
          onClick={() => setHideAds(!hideAds)}
          className="mb-6 px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-900"
        >
          {hideAds
            ? "広告メールを表示"
            : "広告メールを隠す"}
        </button>

        <div className="space-y-4">
          {filteredMails.map((mail) => (
            <div
              key={mail.id}
              onClick={() => {
                const updatedMails = mails.map((m) =>
                  m.id === mail.id
                    ? { ...m, unread: false }
                    : m
                )

                setMails(updatedMails)
              }}
              className={`border border-zinc-800 rounded-xl p-4 ${mail.unread ? "" : "opacity-50"}`}
            >
              <div className="flex justify-between items-center">
                <p className="text-sm text-zinc-400">
                  {mail.sender}
                </p>

                <div className="flex items-center gap-2">
                  <p className="text-sm text-zinc-500">
                    {mail.time}
                  </p>

                  {mail.unread && (
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                  )}
                </div>
              </div>

              <p
                className={`mt-1 text-lg ${mail.unread ? "font-bold text-white" : "text-zinc-600"}`}
              >
                {mail.subject}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}