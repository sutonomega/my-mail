"use client"

import { useEffect, useState } from "react"

// =========================
// Type Definitions
// メールとフォルダの型定義
// =========================

type Mail = {
  id: number
  sender: string
  subject: string
  type: "normal" | "ad"
  unread: boolean
  time: string
  body: string
  saved: boolean
}

type Folder = "inbox" | "quiet" | "unread" | "ads" | "saved"

export default function Home() {

  // =========================
  // Mail Data
  // アプリ内で扱うメールデータ
  // =========================

  const initialMails: Mail[] = [
    {
      id: 1,
      sender: "Amazon",
      subject: "ご注文の商品を発送しました",
      type: "normal",
      unread: true,
      time: "22:14",
      body: "ご注文の商品を発送しました。配送状況は注文履歴から確認できます。到着予定日は明日の午後です。",
      saved: false,
    },
    {
      id: 2,
      sender: "SALE INFO",
      subject: "期間限定セール開催中",
      type: "ad",
      unread: false,
      time: "21:03",
      body: "今だけの限定セールを開催中です。気になる商品がある場合は、キャンペーン終了前にチェックしてください。",
      saved: false,
    },
    {
      id: 3,
      sender: "友達",
      subject: "今度ご飯行こう",
      type: "normal",
      unread: true,
      time: "20:41",
      body: "今週か来週あたりでご飯行かない？落ち着いたお店を見つけたから、都合のいい日があれば教えて。",
      saved: false,
    },
  ]

  const [mails, setMails] = useState<Mail[]>(initialMails)
  const [isLoaded, setIsLoaded] = useState(false)
  // =========================
  // LocalStorage Load
  // 保存済みメールを読み込む
  // =========================
  useEffect(() => {
    const savedMails = localStorage.getItem("quiet-mail")

    if (savedMails) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMails(JSON.parse(savedMails))
    }

    setIsLoaded(true)
  }, [])

  // =========================
  // LocalStorage Save
  // メール状態を保存
  // =========================

  useEffect(() => {
    localStorage.setItem(
      "quiet-mail",
      JSON.stringify(mails)
    )
  }, [mails])

  // =========================
  // UI State
  // 現在の画面状態を管理
  // =========================

  // 広告メールを隠すかどうか
  const [hideAds, setHideAds] = useState(true)

  // 現在選択中のフォルダ
  const [selectedFolder, setSelectedFolder] = useState<Folder>("inbox")

  // 現在開いているメールID
  const [selectedMailId, setSelectedMailId] = useState(1)

  // 検索欄の文字列
  const [searchText, setSearchText] = useState("")

  // =========================
  // Folder Definitions
  // サイドバーに表示するフォルダ一覧
  // =========================

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
    {
      id: "saved" as const,
      label: "Saved",
      count: mails.filter((mail) => mail.saved).length,
    },
  ]
  // =========================
  // Folder Filter
  // 選択中フォルダに応じてメールを絞り込み
  // =========================

  const folderMails = mails.filter((mail) => {
    if (selectedFolder === "quiet") return mail.type === "normal"
    if (selectedFolder === "unread") return mail.unread
    if (selectedFolder === "ads") return mail.type === "ad"
    if (selectedFolder === "saved") return mail.saved
 
    return true
  })


 // =========================
 // Ad Filter
 // Inboxで広告を非表示にする
 // =========================
  const visibleMails =
    hideAds && selectedFolder === "inbox"
      ? folderMails.filter((mail) => mail.type !== "ad")
      : folderMails


 // =========================
 // Search Filter
 // 検索文字列でメールを絞り込み
 // =========================

  const searchQuery = searchText.trim().toLowerCase()

  const filteredMails = searchQuery
    ? visibleMails.filter((mail) =>
        [mail.sender, mail.subject, mail.body]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery)
      )
    : visibleMails

 // =========================
 // Selected Mail
 // 現在選択中のメールを取得
 // =========================

 const selectedMail =
   filteredMails.find((mail) => mail.id === selectedMailId) ??
   filteredMails[0]

 // =========================
 // Mail Actions
 // メール操作系
 // =========================
 
 // メールを開く + 既読化
 const openMail = (mail: Mail) => {
    setSelectedMailId(mail.id)

    const updatedMails = mails.map((m) =>
      m.id === mail.id
        ? { ...m, unread: false }
        : m
    )

    setMails(updatedMails)
  }

// =========================
// Render
// UI描画
// =========================
if (!isLoaded) {
  return null
}
return (
  <>
    {/* =========================
        App Layout
        アプリ全体のレイアウト
    ========================= */}
  <main className="min-h-screen bg-zinc-950 text-zinc-100">

    {/* =========================
        Main Container
        横並びレイアウト用コンテナ
    ========================= */}
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 p-6 lg:flex-row lg:p-8">

      {/* =========================
          Sidebar
          フォルダ一覧と設定
      ========================= */}
      <aside className="w-full border-b border-zinc-800 pb-6 lg:w-64 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">

        {/* アプリタイトル */}
        <h1 className="text-3xl font-light">
          Quiet Mail
        </h1>

        {/* =========================
            Folder Navigation
            フォルダ切り替え
        ========================= */}
        <nav className="mt-8 space-y-2">
          {folders.map((folder) => (

            // フォルダボタン
            <button
              key={folder.id}
              onClick={() => setSelectedFolder(folder.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                  selectedFolder === folder.id
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                }`}
            >

              {/* フォルダ名 */}
              <span>{folder.label}</span>

              {/* フォルダ内メール数 */}
              <span className="text-xs text-zinc-500">
                {folder.count}
              </span>
            </button>
          ))}
        </nav>

        {/* =========================
            Ad Visibility Toggle
            広告メール表示切り替え
        ========================= */}
        <button
          onClick={() => setHideAds(!hideAds)}
          className="mt-8 w-full rounded-lg border border-zinc-800 px-3 py-2 text-left text-sm text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900"
        >
            {hideAds ? "広告メールを表示" : "広告メールを隠す"}
        </button>
      </aside>

      {/* =========================
          Main Content Area
          メール一覧 + 詳細表示
      ========================= */}
      <section className="min-w-0 flex-1">

        {/* =========================
            Header Area
            フォルダ名・検索欄
        ========================= */}
        <div className="mb-6 flex flex-col gap-4">

          {/* フォルダタイトルと状態表示 */}
          <div className="flex items-end justify-between gap-4">

            {/* 左側：フォルダ情報 */}
            <div>

              {/* メール件数 */}
              <p className="text-sm text-zinc-500">
                {filteredMails.length} mails
              </p>

              {/* 現在のフォルダ名 */}
              <h2 className="mt-1 text-2xl font-light text-zinc-100">
                {folders.find((folder) => folder.id === selectedFolder)?.label}
              </h2>
            </div>

            {/* 右側：広告表示状態 */}
            <p className="text-sm text-zinc-500">
              {hideAds && selectedFolder === "inbox"
                ? "Ads hidden"
                : "All visible"}
            </p>
          </div>

          {/* =========================
              Search Input
              メール検索欄
          ========================= */}
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search sender, subject, or body"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-blue-400/70"
          />
        </div>

        {/* =========================
            Mail Layout
            一覧 + 詳細の2カラム
        ========================= */}
        <div className="grid gap-4 xl:grid-cols-[minmax(280px,0.9fr)_minmax(360px,1.1fr)]">

          {/* =========================
              Mail List
              メール一覧
          ========================= */}
          <div className="space-y-4">

            {filteredMails.map((mail) => (
              <button
                key={mail.id}
                onClick={() => openMail(mail)}
                  className={`w-full cursor-pointer rounded-xl border p-4 text-left transition hover:border-zinc-700 hover:bg-zinc-900/70 ${
                    selectedMail?.id === mail.id
                      ? "border-blue-400/60 bg-zinc-900"
                      : "border-zinc-800"
                  } ${mail.unread ? "" : "opacity-50"}`}
              >

                {/* =========================
                    Mail Header
                    差出人 + 時間
                ========================= */}
                <div className="flex items-center justify-between gap-4">

                  {/* 差出人 */}
                  <p className="text-sm text-zinc-400">
                    {mail.sender}
                  </p>

                  {/* 時間 + 未読マーク */}
                  <div className="flex items-center gap-2">

                    {/* 時間 */}
                    <p className="text-sm text-zinc-500">
                      {mail.time}
                    </p>

                    {/* 未読マーク */}
                    {mail.unread && (
                      <div className="h-2 w-2 rounded-full bg-blue-400" />
                    )}
                  </div>
                </div>

                {/* =========================
                    Mail Subject
                    件名表示
                ========================= */}
                  <p
                    className={`mt-1 text-lg ${
                      mail.unread ? "font-bold text-white" : "text-zinc-600"
                    }`}
                  >
                    {mail.subject}
                  </p>
              </button>
            ))}

            {/* =========================
                Empty State
                メールが無い時
            ========================= */}
            {filteredMails.length === 0 && (
              <div className="rounded-xl border border-zinc-800 p-6 text-sm text-zinc-500">
                条件に合うメールはありません
              </div>
            )}
          </div>

          {/* =========================
              Mail Detail
              メール詳細画面
          ========================= */}
          <aside className="min-h-80 rounded-xl border border-zinc-800 bg-zinc-950 p-5">

            {selectedMail ? (
              <div>

                {/* =========================
                    Detail Header
                    件名・差出人・時間
                ========================= */}
                <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">

                  {/* 左側：差出人と件名 */}
                  <div>

                    {/* 差出人 */}
                    <p className="text-sm text-zinc-500">
                      {selectedMail.sender}
                    </p>

                    {/* 件名 */}
                    <h3 className="mt-2 text-2xl font-light text-white">
                      {selectedMail.subject}
                    </h3>
                    {selectedMail.saved && (
                      <div className="mt-3 inline-flex items-center rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs text-blue-300">
                        Saved
                      </div>
                    )}
                  </div>

                  {/* 時間 */}
                  <p className="shrink-0 text-sm text-zinc-500">
                    {selectedMail.time}
                  </p>
                </div>

                {/* =========================
                    Mail Body
                    本文表示
                ========================= */}
                <p className="mt-6 whitespace-pre-wrap leading-7 text-zinc-300">
                  {selectedMail.body}
                </p>

                {/* =========================
                    Mail Actions
                    Save ボタン
                    Unread ボタン
                ========================= */}
                <div className="mt-6 flex gap-3">

                  <button
                    onClick={() => {
                      const updatedMails = mails.map((m) =>
                        m.id === selectedMail.id
                          ? { ...m, saved: !m.saved }
                          : m
                      )

                      setMails(updatedMails)
                    }}
                    className={`rounded-lg border px-4 py-2 text-sm transition ${selectedMail.saved
                      ? "border-blue-400/60 bg-blue-400/10 text-blue-300"
                      : "border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                      } `}
                  >
                    {selectedMail.saved ? "Saved" : "Save"}
                  </button>

                  <button
                    onClick={() => {
                      const updatedMails = mails.map((m) =>
                        m.id === selectedMail.id
                          ? { ...m, unread: !m.unread }
                          : m
                      )
                    
                      setMails(updatedMails)
                    }}
                    className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900"
                  >
                    {selectedMail.unread ? "Read" : "Unread"}
                  </button>

                </div>

                {/* =========================
                    Ad Warning
                    広告メール通知
                ========================= */}
                {selectedMail.type === "ad" && (
                  <p className="mt-6 rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-500">
                    Quiet Mail はこのメールを広告メールとして扱っています。
                  </p>
                )}
              </div>
            ) : (
              <div className="flex min-h-64 items-center justify-center text-sm text-zinc-500">
                メールを選択してください
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  </main>
</>
)
}
