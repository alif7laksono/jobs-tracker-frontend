// app/api/error/page.tsx

"use client";

export default function ErrorPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600">Login Error</h2>
        <p className="mt-4">Failed to sign in. Please try again.</p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
