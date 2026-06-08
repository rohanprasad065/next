'use client'

import { useState } from 'react'

export default function DashboardDemo() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <nav className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-blue-600">
            MyApp
          </h1>

          <div className="hidden gap-6 md:flex">
            <a href="#" className="hover:text-blue-600">
              Home
            </a>
            <a href="#" className="hover:text-blue-600">
              Features
            </a>
            <a href="#" className="hover:text-blue-600">
              Pricing
            </a>
            <a href="#" className="hover:text-blue-600">
              Contact
            </a>
          </div>

          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Login
          </button>
        </div>
      </nav>

      <div className="flex">
        {/* SIDEBAR */}
        <aside className="hidden min-h-screen w-64 bg-slate-900 text-white lg:block">
          <div className="p-6">
            <h2 className="mb-6 text-xl font-bold">
              Dashboard
            </h2>

            <ul className="space-y-3">
              <li className="cursor-pointer rounded p-2 hover:bg-slate-800">
                Overview
              </li>
              <li className="cursor-pointer rounded p-2 hover:bg-slate-800">
                Analytics
              </li>
              <li className="cursor-pointer rounded p-2 hover:bg-slate-800">
                Users
              </li>
              <li className="cursor-pointer rounded p-2 hover:bg-slate-800">
                Settings
              </li>
            </ul>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6">
          {/* HERO */}
          <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <h1 className="mb-4 text-4xl font-bold">
              Welcome to the Dashboard
            </h1>

            <p className="mb-6 max-w-xl">
              This section is called a Hero Section.
              It usually contains the main heading,
              description and call-to-action buttons.
            </p>

            <div className="flex gap-4">
              <button className="rounded-lg bg-white px-5 py-3 font-medium text-black">
                Get Started
              </button>

              <button className="rounded-lg border border-white px-5 py-3">
                Learn More
              </button>
            </div>
          </section>

          {/* STATS */}
          <section className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              'Users',
              'Revenue',
              'Orders',
              'Growth',
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl bg-white p-6 shadow"
              >
                <p className="text-gray-500">{item}</p>

                <h3 className="mt-2 text-3xl font-bold">
                  1,234
                </h3>
              </div>
            ))}
          </section>

          {/* CARDS */}
          <section className="mt-8">
            <h2 className="mb-4 text-2xl font-bold">
              Cards
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((card) => (
                <div
                  key={card}
                  className="rounded-xl bg-white p-6 shadow"
                >
                  <img
                    src="https://picsum.photos/300/200"
                    alt="card"
                    className="mb-4 rounded-lg"
                  />

                  <h3 className="mb-2 text-xl font-semibold">
                    Card Title
                  </h3>

                  <p className="text-gray-600">
                    Example card content used to
                    demonstrate layouts.
                  </p>

                  <button className="mt-4 rounded bg-blue-600 px-4 py-2 text-white">
                    Read More
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* FORM */}
          <section className="mt-8 rounded-xl bg-white p-6 shadow">
            <h2 className="mb-6 text-2xl font-bold">
              Contact Form
            </h2>

            <form className="space-y-4">
              <div>
                <label className="mb-2 block font-medium">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Message
                </label>

                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  rows={4}
                  className="w-full rounded-lg border p-3"
                  placeholder="Type message..."
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-green-600 px-5 py-3 text-white"
              >
                Submit
              </button>
            </form>
          </section>

          {/* TABLE */}
          <section className="mt-8 rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-bold">
              Users Table
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">
                      Name
                    </th>
                    <th className="p-3 text-left">
                      Email
                    </th>
                    <th className="p-3 text-left">
                      Role
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b">
                    <td className="p-3">John</td>
                    <td className="p-3">
                      john@test.com
                    </td>
                    <td className="p-3">Admin</td>
                  </tr>

                  <tr className="border-b">
                    <td className="p-3">Sarah</td>
                    <td className="p-3">
                      sarah@test.com
                    </td>
                    <td className="p-3">Editor</td>
                  </tr>

                  <tr>
                    <td className="p-3">Mike</td>
                    <td className="p-3">
                      mike@test.com
                    </td>
                    <td className="p-3">User</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="mt-10 bg-slate-900 py-8 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h3 className="text-xl font-bold">
            MyApp
          </h3>

          <p className="mt-2 text-gray-400">
            Example footer section.
          </p>

          <div className="mt-4 flex gap-4">
            <a href="#">Twitter</a>
            <a href="#">GitHub</a>
            <a href="#">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  )
}