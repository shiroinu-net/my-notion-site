import s from "./SectionHeader.module.css";

type Props = {
  /** 見出しテキスト（例: "Profile"） */
  title: string;
  /** 通し番号（例: "01"）。指定すると右側に "01 — about" のラベルが出る */
  no?: string;
  /** ラベル語（例: "about"） */
  label?: string;
  /** 下マージン。セクションごとに詰め具合が違うので個別指定できる */
  marginBottom?: string;
};

/**
 * 各セクション共通の見出し。
 *   ✦  Profile  ──────────  01 — about
 * デザインを変えたいときは SectionHeader.module.css を1箇所いじればOK。
 */
export default function SectionHeader({ title, no, label, marginBottom }: Props) {
  return (
    <div className={s.header} style={marginBottom ? { marginBottom } : undefined}>
      <span className={s.star}>✦</span>
      <h2 className={s.title}>{title}</h2>
      <span className={s.line} />
      {no && (
        <span className={s.label}>
          {no} — {label}
        </span>
      )}
    </div>
  );
}
