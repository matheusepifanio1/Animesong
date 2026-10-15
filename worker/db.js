// Banco do OPdle: um Durable Object com SQLite (plano grátis da Cloudflare).
// Guarda o resultado de cada jogador por dia, os grupos de amigos e quem está em cada grupo.
// O "player" é um id aleatório gerado no navegador; ele nunca é mostrado para os outros.

import { DurableObject } from "cloudflare:workers";

const CLIPS = 6;
const pointsOf = (a) => (a >= 1 && a <= CLIPS ? CLIPS + 1 - a : 0); // a = tentativa do acerto (1–6), 0 = errou
const CODE_CHARS = "abcdefghjkmnpqrstuvwxyz23456789";

export class OpdleDB extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS players (player TEXT PRIMARY KEY, name TEXT NOT NULL DEFAULT '', created INTEGER)`);
    this.sql.exec(`CREATE TABLE IF NOT EXISTS results (date TEXT NOT NULL, player TEXT NOT NULL, score INTEGER NOT NULL,
      a1 INTEGER, a2 INTEGER, a3 INTEGER, a4 INTEGER, a5 INTEGER, created INTEGER, PRIMARY KEY (date, player))`);
    this.sql.exec(`CREATE TABLE IF NOT EXISTS groups (code TEXT PRIMARY KEY, name TEXT NOT NULL, owner TEXT, created INTEGER)`);
    this.sql.exec(`CREATE TABLE IF NOT EXISTS members (code TEXT NOT NULL, player TEXT NOT NULL, joined INTEGER, PRIMARY KEY (code, player))`);
    this.sql.exec(`CREATE INDEX IF NOT EXISTS members_by_player ON members (player)`);
  }

  rows(q, ...b) { return this.sql.exec(q, ...b).toArray(); }

  upsertPlayer(player, name) {
    const now = Date.now();
    this.sql.exec(`INSERT INTO players (player, name, created) VALUES (?, ?, ?)
      ON CONFLICT(player) DO UPDATE SET name = CASE WHEN excluded.name <> '' THEN excluded.name ELSE players.name END`, player, name || "", now);
  }

  // resultado do dia; só o primeiro envio vale
  submit({ player, name, date, attempts }) {
    this.upsertPlayer(player, name);
    const score = attempts.reduce((t, a) => t + pointsOf(a), 0);
    this.sql.exec(`INSERT OR IGNORE INTO results (date, player, score, a1, a2, a3, a4, a5, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      date, player, score, ...attempts, Date.now());
    return { ok: true, score };
  }

  stats(date) {
    const t = this.rows(`SELECT COUNT(*) AS n, AVG(score) AS avg,
      SUM(a1 > 0) AS c1, SUM(a2 > 0) AS c2, SUM(a3 > 0) AS c3, SUM(a4 > 0) AS c4, SUM(a5 > 0) AS c5
      FROM results WHERE date = ?`, date)[0] || {};
    const n = t.n || 0;
    return {
      date, players: n, avg: n ? Math.round(t.avg * 10) / 10 : null,
      rounds: [t.c1, t.c2, t.c3, t.c4, t.c5].map((c) => ({ correct: c || 0, pct: n ? Math.round((c || 0) / n * 100) : null }))
    };
  }

  setName(player, name) { this.upsertPlayer(player, name); return { ok: true }; }

  createGroup({ player, name, groupName }) {
    this.upsertPlayer(player, name);
    let code;
    for (let i = 0; i < 20; i++) {
      code = Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => CODE_CHARS[b % CODE_CHARS.length]).join("");
      if (!this.rows(`SELECT 1 FROM groups WHERE code = ?`, code).length) break;
    }
    this.sql.exec(`INSERT INTO groups (code, name, owner, created) VALUES (?, ?, ?, ?)`, code, groupName, player, Date.now());
    this.sql.exec(`INSERT OR IGNORE INTO members (code, player, joined) VALUES (?, ?, ?)`, code, player, Date.now());
    return { code, name: groupName };
  }

  groupInfo(code) {
    const g = this.rows(`SELECT code, name FROM groups WHERE code = ?`, code)[0];
    if (!g) return null;
    const n = this.rows(`SELECT COUNT(*) AS n FROM members WHERE code = ?`, code)[0].n;
    return { code: g.code, name: g.name, members: n };
  }

  joinGroup({ player, name, code }) {
    const g = this.groupInfo(code);
    if (!g) return { error: "Grupo não encontrado." };
    this.upsertPlayer(player, name);
    this.sql.exec(`INSERT OR IGNORE INTO members (code, player, joined) VALUES (?, ?, ?)`, code, player, Date.now());
    return { ok: true, code: g.code, name: g.name };
  }

  leaveGroup({ player, code }) {
    this.sql.exec(`DELETE FROM members WHERE code = ? AND player = ?`, code, player);
    return { ok: true };
  }

  myGroups(player) {
    return this.rows(`SELECT g.code, g.name, (SELECT COUNT(*) FROM members m2 WHERE m2.code = g.code) AS members
      FROM members m JOIN groups g ON g.code = m.code WHERE m.player = ? ORDER BY m.joined`, player);
  }

  // ranking do grupo: hoje e soma dos últimos 7 dias (só resultados feitos no próprio dia)
  ranking({ code, player, date, weekStart }) {
    const g = this.groupInfo(code);
    if (!g) return { error: "Grupo não encontrado." };
    const isMember = this.rows(`SELECT 1 FROM members WHERE code = ? AND player = ?`, code, player).length > 0;
    const list = this.rows(`SELECT p.player, p.name,
        (SELECT score FROM results r WHERE r.player = p.player AND r.date = ?) AS today,
        (SELECT a1 || ',' || a2 || ',' || a3 || ',' || a4 || ',' || a5 FROM results r WHERE r.player = p.player AND r.date = ?) AS att,
        (SELECT COALESCE(SUM(score), 0) FROM results r WHERE r.player = p.player AND r.date >= ? AND r.date <= ?) AS week,
        (SELECT COUNT(*) FROM results r WHERE r.player = p.player AND r.date >= ? AND r.date <= ?) AS days
      FROM members m JOIN players p ON p.player = m.player WHERE m.code = ?`,
      date, date, weekStart, date, weekStart, date, code);
    return {
      code: g.code, name: g.name, date, isMember,
      members: list.map((r) => ({
        name: r.name || "Sem nome", me: r.player === player,
        today: r.today, attempts: r.att ? r.att.split(",").map(Number) : null, week: r.week, days: r.days
      }))
    };
  }
}
