import { ImageResponse } from "next/og";

export const alt = "Plutolio – From Financial Chaos to Perfect Clarity";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GREEN = "#34d399";
const GREEN_DARK = "#10b981";

const pills = [
    { icon: "🏦", label: "Multi-Account" },
    { icon: "🏷️", label: "Categories" },
    { icon: "🎯", label: "Budgets" },
    { icon: "📸", label: "Receipts" },
    { icon: "🔒", label: "Secure" },
];

// Satori (the renderer behind ImageResponse) requires EVERY element that has
// more than one child to declare display: "flex" explicitly. There is no
// default block/inline layout — omitting it causes the prerender build error.
export default function OGImage() {
    return new ImageResponse(
        <div
            style={{
                display: "flex",
                width: "1200px",
                height: "630px",
                flexDirection: "column",
                backgroundColor: "#0a0a0a",
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* ── Background dot grid ───────────────────────────────── */}
            <div
                style={{
                    display: "flex",
                    position: "absolute",
                    inset: "0",
                    backgroundImage:
                        "linear-gradient(rgba(52,211,153,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.07) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            {/* ── Top green glow ────────────────────────────────────── */}
            <div
                style={{
                    display: "flex",
                    position: "absolute",
                    top: "-200px",
                    left: "150px",
                    width: "900px",
                    height: "520px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(ellipse at center, rgba(52,211,153,0.22) 0%, transparent 70%)",
                }}
            />

            {/* ── Bottom-right blue glow ────────────────────────────── */}
            <div
                style={{
                    display: "flex",
                    position: "absolute",
                    bottom: "-140px",
                    right: "-100px",
                    width: "600px",
                    height: "400px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(ellipse at center, rgba(59,130,246,0.14) 0%, transparent 70%)",
                }}
            />

            {/* ── Main content ──────────────────────────────────────── */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    padding: "52px 68px",
                    height: "100%",
                }}
            >
                {/* Row 1 — logo + badge */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    {/* Logo mark + wordmark */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "52px",
                                height: "52px",
                                borderRadius: "14px",
                                background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
                                boxShadow: "0 0 28px rgba(52,211,153,0.45)",
                            }}
                        >
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <rect
                                    x="3"
                                    y="12"
                                    width="4"
                                    height="9"
                                    rx="1"
                                    fill="white"
                                />
                                <rect
                                    x="10"
                                    y="7"
                                    width="4"
                                    height="14"
                                    rx="1"
                                    fill="white"
                                />
                                <rect
                                    x="17"
                                    y="3"
                                    width="4"
                                    height="18"
                                    rx="1"
                                    fill="white"
                                />
                            </svg>
                        </div>
                        <span
                            style={{
                                display: "flex",
                                fontSize: "30px",
                                fontWeight: "800",
                                color: "#ffffff",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            Plutolio
                        </span>
                    </div>

                    {/* Badge */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            border: "1px solid rgba(52,211,153,0.30)",
                            borderRadius: "999px",
                            padding: "8px 20px",
                            background: "rgba(52,211,153,0.08)",
                        }}
                    >
                        <span style={{ display: "flex", fontSize: "17px" }}>
                            💸
                        </span>
                        <span
                            style={{
                                display: "flex",
                                fontSize: "15px",
                                color: "#6ee7b7",
                                fontWeight: "600",
                            }}
                        >
                            Personal Finance Tracker
                        </span>
                    </div>
                </div>

                {/* Row 2 — headline + subtext */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "18px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            fontSize: "74px",
                            fontWeight: "900",
                            color: "#ffffff",
                            lineHeight: "1.0",
                            letterSpacing: "-2px",
                        }}
                    >
                        <span style={{ display: "flex" }}>
                            From Financial Chaos
                        </span>
                        <span style={{ display: "flex", color: GREEN }}>
                            to Perfect Clarity
                        </span>
                    </div>
                    <span
                        style={{
                            display: "flex",
                            fontSize: "23px",
                            color: "rgba(255,255,255,0.52)",
                            maxWidth: "660px",
                            lineHeight: "1.5",
                        }}
                    >
                        Track accounts, categorize expenses, attach receipts,
                        and set budgets — all in one place.
                    </span>
                </div>

                {/* Row 3 — feature pills + CTA */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    {/* Pills */}
                    <div style={{ display: "flex", gap: "10px" }}>
                        {pills.map((p) => (
                            <div
                                key={p.label}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    background: "rgba(255,255,255,0.055)",
                                    border: "1px solid rgba(255,255,255,0.10)",
                                    borderRadius: "8px",
                                    padding: "8px 14px",
                                }}
                            >
                                <span
                                    style={{
                                        display: "flex",
                                        fontSize: "15px",
                                    }}
                                >
                                    {p.icon}
                                </span>
                                <span
                                    style={{
                                        display: "flex",
                                        fontSize: "14px",
                                        color: "rgba(255,255,255,0.72)",
                                        fontWeight: "600",
                                    }}
                                >
                                    {p.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
                            borderRadius: "12px",
                            padding: "14px 30px",
                            boxShadow: "0 0 28px rgba(52,211,153,0.38)",
                        }}
                    >
                        <span
                            style={{
                                display: "flex",
                                fontSize: "18px",
                                fontWeight: "800",
                                color: "#052e16",
                            }}
                        >
                            Start Free →
                        </span>
                    </div>
                </div>
            </div>
        </div>,
        { ...size },
    );
}
