const SUPABASE_URL = "https://jdsaadxpufkyenrokjvu.supabase.co";
const SUPABASE_KEY = "sb_publishable_quWoejK9m8zSsj-dqhdxZg_r5t8HnSQ";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function requireRole(role) {
  const { data: { session } } = await db.auth.getSession();
  if (!session) { location.href = "index.html"; return null; }
  const { data: p } = await db.from("profiles").select("*").eq("id", session.user.id).single();
  if (!p || p.role !== role) { location.href = "index.html"; return null; }
  return p;
}

async function logout() {
  await db.auth.signOut();
  location.href = "index.html";
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function toast(msg) {
  let t = document.getElementById("toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = "show";
  setTimeout(() => (t.className = ""), 2600);
}

const STATUSES = ["pending", "waiting", "processed", "delivered"];
