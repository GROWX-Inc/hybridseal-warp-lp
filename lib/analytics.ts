"use client";

/**
 * 計測の「接続枠」だけを用意したスタブ。
 * 制作マスター指示書 第6章：いまは様子見段階。デザイン完成を優先し、
 * 計測は接続箇所だけ用意して Pro判断後に有効化する。
 *
 * 環境変数が無い／無効化されている場合は、何もせず安全に no-op となる。
 *
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   NEXT_PUBLIC_ANALYTICS_ENABLED = "true" で初めて送信
 *
 * テーブル events(project, event, meta, created_at) に anon insert する想定。
 */

const PROJECT = "hybridseal-warp";

function enabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" &&
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export type AnalyticsEvent =
  | "page_view"
  | "section_view"
  | "interaction" // 拭いた・めくった等
  | "session_end";

export function trackEvent(
  event: AnalyticsEvent,
  meta: Record<string, unknown> = {}
): void {
  // 接続枠のみ。無効時は no-op（コンソールにも出さない）。
  if (!enabled()) return;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  try {
    const body = JSON.stringify({ project: PROJECT, event, meta });
    // sendBeacon が使えれば離脱時も取りこぼしにくい
    const endpoint = `${url}/rest/v1/events`;

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=minimal",
      },
      body,
      keepalive: true,
    }).catch(() => {
      /* 計測失敗はUXに影響させない */
    });
  } catch {
    /* no-op */
  }
}
