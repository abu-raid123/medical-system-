import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #1a2a5e 0%, #2B3D77 50%, #366FB4 100%)",
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/images/seha-logo.png"
            alt="Seha"
            className="w-32 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-[#2B3D77] mb-1">
            تسجيل الدخول
          </h1>
          <p className="text-gray-500">Login to Medical Leave System</p>
        </div>

        <form action={loginAction} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              اسم المستخدم / Username
            </label>
            <input
              type="text"
              name="username"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="أدخل اسم المستخدم"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              كلمة المرور / Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="أدخل كلمة المرور"
            />
          </div>

          {hasError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm whitespace-pre-line">
              {"اسم المستخدم أو كلمة المرور غير صحيحة\nInvalid username or password"}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#2B3D77] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#1a2a5e] transition-all"
          >
            دخول / Login
          </button>
        </form>
      </div>
    </div>
  );
}
