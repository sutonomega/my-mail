"use client"

import { useState } from "react"

type Mail = {
  id: number
  sender: string
  subject: string
  type: "normal" | "ad"
  unread: boolean
  time: string
}

type Folder = "inbox" | "quiet" | "unread" | "ads"

export default function Home() {
  const [mails, setMails] = useState<Mail[]>([
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
  const [selectedFolder, setSelectedFolder] = useState<Folder>("inbox")

  const folders = [
    { id: "inbox" as const, label: "Inbox", count: mails.length },
    {
      id: "quiet" as const,
      label: "Quiet",
      count: mails.filter((mail) => mail.type === "normal").length,
    },
    {
      id: "unread" as const,
      label: "Unread",
      count: mails.filter((mail) => mail.unread).length,
    },
    {
      id: "ads" as const,
      label: "Ads",
      count: mails.filter((mail) => mail.type === "ad").length,
    },
  ]

  const folderMails = mails.filter((mail) => {
    if (selectedFolder === "quiet") return mail.type === "normal"
    if (selectedFolder === "unread") return mail.unread
    if (selectedFolder === "ads") return mail.type === "ad"

    return true
  })

  const filteredMails =
    hideAds && selectedFolder === "inbox"
      ? folderMails.filter((mail) => mail.type !== "ad")
      : folderMails

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 p-6 md:flex-row md:p-8">
        <aside className="w-full border-b border-zinc-800 pb-6 md:w-64 md:border-b-0 md:border-r md:pb-0 md:pr-6">
          <h1 className="text-3xl font-light">
            Quiet Mail
          </h1>

          <nav className="mt-8 space-y-2">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                  selectedFolder === folder.id
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                }`}
              >
                <span>{folder.label}</span>
                <span className="text-xs text-zinc-500">
                  {folder.count}
                </span>
              </button>
            ))}
          </nav>

          <button
            onClick={() => setHideAds(!hideAds)}
            className="mt-8 w-full rounded-lg border border-zinc-800 px-3 py-2 text-left text-sm text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900"
          >
            {hideAds ? "広告メールを表示" : "広告メールを隠す"}
          </button>
        </aside>

        <section className="flex-1">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-500">
                {filteredMails.length} mails
              </p>
              <h2 className="mt-1 text-2xl font-light text-zinc-100">
                {folders.find((folder) => folder.id === selectedFolder)?.label}
              </h2>
            </div>

            <p className="text-sm text-zinc-500">
              {hideAds && selectedFolder === "inbox"
                ? "Ads hidden"
                : "All visible"}
            </p>
          </div>

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
                className={`cursor-pointer rounded-xl border border-zinc-800 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/70 ${
                  mail.unread ? "" : "opacity-50"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-zinc-400">
                    {mail.sender}
                  </p>

                  <div className="flex items-center gap-2">
                    <p className="text-sm text-zinc-500">
                      {mail.time}
                    </p>

                    {mail.unread && (
                      <div className="h-2 w-2 rounded-full bg-blue-400" />
                    )}
                  </div>
                </div>

                <p
                  className={`mt-1 text-lg ${
                    mail.unread ? "font-bold text-white" : "text-zinc-600"
                  }`}
                >
                  {mail.subject}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
