import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Plutolio – From Financial Chaos to Perfect Clarity";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
    return new ImageResponse(
        <div
            style={{
                width: "1200px",
                height: "630px",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#0a0a0a",
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* ── Background grid ─────────────────────────────────────── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "linear-gradient(rgba(52,211,153,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.07) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            {/* ── Radial glow – top centre ────────────────────────────── */}
            <div
                style={{
                    position: "absolute",
                    top: "-160px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "900px",
                    height: "520px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(ellipse at center, rgba(52,211,153,0.18) 0%, transparent 70%)",
                }}
            />

            {/* ── Subtle bottom glow ──────────────────────────────────── */}
            <div
                style={{
                    position: "absolute",
                    bottom: "-120px",
                    right: "-80px",
                    width: "600px",
                    height: "400px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, transparent 70%)",
                }}
            />

            {/* ── Main content ────────────────────────────────────────── */}
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "56px 72px",
                    height: "100%",
                }}
            >
                {/* Top: logo + badge */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    {/* Logo */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                        }}
                    >
                        <div
                            style={{
                                width: "52px",
                                height: "52px",
                                borderRadius: "14px",
                                background:
                                    "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 0 32px rgba(52,211,153,0.4)",
                            }}
                        >
                            {/* Bar chart icon (inline SVG path) */}
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
                                fontSize: "32px",
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
                            border: "1px solid rgba(52,211,153,0.3)",
                            borderRadius: "999px",
                            padding: "8px 18px",
                            background: "rgba(52,211,153,0.08)",
                        }}
                    >
                        <span style={{ fontSize: "18px" }}>💸</span>
                        <span
                            style={{
                                fontSize: "15px",
                                color: "#6ee7b7",
                                fontWeight: "600",
                            }}
                        >
                            Personal Finance Tracker
                        </span>
                    </div>
                </div>

                {/* Centre: headline */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "76px",
                            fontWeight: "900",
                            color: "#ffffff",
                            lineHeight: "1.0",
                            letterSpacing: "-2px",
                        }}
                    >
                        From Financial Chaos
                        <br />
                        <span style={{ color: "#34d399" }}>
                            to Perfect Clarity
                        </span>
                    </div>
                    <div
                        style={{
                            fontSize: "24px",
                            color: "rgba(255,255,255,0.55)",
                            fontWeight: "400",
                            maxWidth: "680px",
                            lineHeight: "1.5",
                        }}
                    >
                        Track accounts, categorize expenses, attach receipts,
                        and set budgets — all in one place.
                    </div>
                </div>

                {/* Bottom: feature pills + CTA */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    {/* Feature pills */}
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                        }}
                    >
                        {[
                            { icon: "🏦", label: "Multi-Account" },
                            { icon: "🏷️", label: "Categories" },
                            { icon: "🎯", label: "Budgets" },
                            { icon: "📸", label: "Receipts" },
                            { icon: "🔒", label: "Secure" },
                        ].map((f) => (
                            <div
                                key={f.label}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "8px",
                                    padding: "8px 14px",
                                }}
                            >
                                <span style={{ fontSize: "16px" }}>
                                    {f.icon}
                                </span>
                                <span
                                    style={{
                                        fontSize: "15px",
                                        color: "rgba(255,255,255,0.75)",
                                        fontWeight: "600",
                                    }}
                                >
                                    {f.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* CTA button */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            background:
                                "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                            borderRadius: "12px",
                            padding: "14px 28px",
                            boxShadow: "0 0 24px rgba(52,211,153,0.35)",
                        }}
                    >
                        <span
                            style={{
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

            {/* ── Decorative mini stat cards (right side) ─────────────── */}
            <div
                style={{
                    position: "absolute",
                    right: "60px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    opacity: 0,
                }}
            />
        </div>,
        {
            ...size,
        },
    );
}
