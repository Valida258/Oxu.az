import { useState } from "react";
import { adminLogin } from "../../api/admin/admin";
import { useNavigate } from "@tanstack/react-router"; 

export default function AdminLogin() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const navigate = useNavigate(); 

  async function handleLogin(e) {
    // Form onSubmit olduqda 'e' (event) avtomatik bura gəlir və problemsiz işləyir
    e.preventDefault(); 

    if (!login || !password) {
      setResult({ type: "error", data: { error: "login və password tələb olunur" } });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await adminLogin(login, password);
      setResult({ type: "success", data });

      if (data && data.token) {
        localStorage.setItem("admin_token", data.token);
      }

      // İndi həm event düzgündür, həm də navigate problemsiz yönləndirəcək
      navigate({ to: "/admin" }); 

    } catch (error) {
      setResult({ type: "error", data: { error: error.message } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-zinc-100 p-8">
      <form 
        onSubmit={handleLogin} 
        className="bg-white border border-zinc-200 rounded-xl p-8 w-full max-w-md shadow-sm"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div>
            <p className="text-sm font-medium text-zinc-800">Admin Panel Giriş</p>
          </div>
        </div>

        {/* Login field */}
        <div className="mb-4">
          <label className="block text-xs text-zinc-500 mb-1">
            Login
          </label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="admin"
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
          />
        </div>

        {/* Password field */}
        <div className="mb-6">
          <label className="block text-xs text-zinc-500 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
            />
            <button
              type="button" // Form daxilindəki digər düymələrin form-u submit etməməsi üçün type="button" vacibdir
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-sm"
            >
              {showPass ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit" // Təyin olunmuş onSubmit funksiyasını tetikləyir
          disabled={loading}
          className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-300 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
        >
          {loading ? "Gözlə..." : "Daxil ol"}
        </button>

        {/* Result */}
        {result && (
          <div
            className={`mt-4 rounded-lg p-3 text-xs font-mono whitespace-pre-wrap break-all ${
              result.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {JSON.stringify(result.data, null, 2)}
          </div>
        )}
      </form>
    </div>
  );
}